'use client'

// Visionneuse 3D du configurateur (three.js). Le modèle (public/configurateur/montre.glb) contient
// toutes les variantes ; on n'affiche que celles de la configuration. Les matières du fichier
// ne sont que des noms de rôle (acier_poli, cadran...) remplacés ici par les vraies matières.
// Rendu à la demande : rien ne tourne quand l'image ne bouge pas (batterie sur mobile).

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { teinteCadran, teinteChiffres, type Configuration, type PieceId } from '@/lib/configurateur/catalogue'

const MODELE = '/configurateur/montre.glb'

/** Écart de chaque groupe dans la vue éclatée, le long de l'axe du cadran (unités du modèle : cm). */
const ECARTS: Record<string, number> = {
  lunette: 1.5,
  verre: 1.15,
  aiguilles: 0.85,
  chiffres: 0.55,
  cadran: 0.28,
  mouvement: -0.6,
  fond: -1.25,
  bracelet: -0.9,
}
const ECART_COURONNE = 0.55 // la couronne s'écarte sur le côté

/** Groupe du modèle -> pièce du configurateur (toucher la pièce ouvre ses choix). */
const PIECE_DE_GROUPE: Record<string, PieceId> = {
  lunette: 'lunette',
  cadran: 'cadran',
  date_guichet: 'date',
  date_loupe: 'date',
  chiffres: 'chiffres',
  aiguilles: 'aiguilles',
  fond: 'fond',
  mouvement: 'fond',
  bracelet: 'bracelet',
}

export type EtatChargement = { etat: 'chargement'; progression: number } | { etat: 'pret' } | { etat: 'erreur' }

interface Props {
  config: Configuration
  eclatement: number
  onToucherPiece: (piece: PieceId) => void
  onEtat: (etat: EtatChargement) => void
  /** Incrémenter pour ramener la caméra à sa place. */
  recentrer: number
}

interface Scene3D {
  appliquerConfig: (c: Configuration) => void
  /** Pose immédiate (curseur glissé). */
  appliquerEclatement: (t: number) => void
  /** Transition douce (grand saut : clic sur la piste, bouton). */
  animerEclatement: (t: number) => void
  recentrer: () => void
}

/**
 * Studio sombre à bandes de lumière, reflété par l'acier (même principe que les rendus
 * validés de la montre phare) : un fond presque noir et quelques panneaux lumineux.
 * Un environnement clair et uniforme rend l'acier plat et le cadran noir gris.
 */
function creerStudio() {
  const studio = new THREE.Scene()
  const fond = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0x0c0b0a, side: THREE.BackSide }),
  )
  studio.add(fond)
  const panneau = (l: number, h: number, intensite: number, pos: [number, number, number], teinte = 0xffffff) => {
    const m = new THREE.MeshBasicMaterial({ color: teinte, side: THREE.DoubleSide })
    m.color.multiplyScalar(intensite)
    const p = new THREE.Mesh(new THREE.PlaneGeometry(l, h), m)
    p.position.set(...pos)
    p.lookAt(0, 0, 0)
    studio.add(p)
  }
  panneau(30, 14, 5, [0, 22, 6])              // grande boîte à lumière au-dessus
  panneau(4, 40, 7, [-24, 2, 8], 0xfff3e6)    // bande verticale à gauche, chaude
  panneau(4, 40, 5, [24, 0, 4], 0xe8f0ff)     // bande verticale à droite, froide
  panneau(14, 4, 0.8, [6, -14, 22])           // débouchage bas, très faible (le cadran noir doit rester noir)
  panneau(10, 10, 1.5, [0, 8, -28])           // contre-jour
  return studio
}

function creerMatieres() {
  const m = {
    acier_poli: new THREE.MeshPhysicalMaterial({ color: 0xeaebed, metalness: 1, roughness: 0.1 }),
    acier_brosse: new THREE.MeshPhysicalMaterial({ color: 0xdedfe2, metalness: 1, roughness: 0.34 }),
    aiguille: new THREE.MeshPhysicalMaterial({ color: 0xe6e7ea, metalness: 1, roughness: 0.26 }),
    // rehaut (bague inclinée autour du cadran) : satiné, sinon il renvoie toute une bande de lumière
    rehaut: new THREE.MeshPhysicalMaterial({ color: 0xb9bbbf, metalness: 1, roughness: 0.42 }),
    // pièces fines ou ouvertes (cadran, chapitre, imprimés) : visibles des deux côtés par sécurité
    cadran: new THREE.MeshPhysicalMaterial({ roughness: 0.32, clearcoat: 0.35, clearcoatRoughness: 0.1, side: THREE.DoubleSide }),
    chapitre: new THREE.MeshPhysicalMaterial({ roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.05, side: THREE.DoubleSide }),
    chiffre: new THREE.MeshPhysicalMaterial({ roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03 }),
    imprime: new THREE.MeshStandardMaterial({ roughness: 0.5, side: THREE.DoubleSide }),
    lume: new THREE.MeshStandardMaterial({ color: 0xe6eedb, roughness: 0.6, emissive: 0x20291c }),
    // verre saphir : presque invisible, seuls de légers reflets (le cadran doit rester lisible)
    verre: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0, transmission: 1, ior: 1.5, thickness: 0,
      specularIntensity: 0.12, envMapIntensity: 0.25,
    }),
    date_disque: new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.55 }),
    date_chiffre: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }),
    platine: new THREE.MeshPhysicalMaterial({ color: 0xc4c6ca, metalness: 1, roughness: 0.42 }),
    pont: new THREE.MeshPhysicalMaterial({ color: 0xd6d8dc, metalness: 1, roughness: 0.22 }),
    laiton: new THREE.MeshPhysicalMaterial({ color: 0xd2a458, metalness: 1, roughness: 0.25 }),
    rubis: new THREE.MeshPhysicalMaterial({ color: 0x8e0b1c, roughness: 0.08, clearcoat: 1 }),
    vis_bleue: new THREE.MeshPhysicalMaterial({ color: 0x1f3d94, metalness: 0.8, roughness: 0.2 }),
  }
  return m
}

type Matieres = ReturnType<typeof creerMatieres>

function teinterCadran(m: Matieres, c: Configuration) {
  const t = teinteCadran(c.cadran)
  const couleur = new THREE.Color(t.hex)
  m.cadran.color.copy(couleur)
  m.cadran.metalness = t.metal
  // un cadran peint métallisé ne prend sa couleur que par ses reflets : on les renforce ;
  // le noir laqué garde des reflets neutres faibles pour rester noir
  m.cadran.envMapIntensity = t.metal ? 2.6 : 1
  m.chapitre.color.copy(couleur).multiplyScalar(0.55)
  m.chapitre.metalness = t.metal * 0.6
  m.imprime.color.set(t.claire ? 0x1a1a1a : 0xeeeeea)
  const ch = teinteChiffres(c.chiffres === 'index' ? 'acier' : c.couleurChiffres)
  m.chiffre.color.set(ch.hex)
  m.chiffre.metalness = ch.metal
  m.chiffre.roughness = ch.metal ? 0.1 : 0.12
}

export default function Visionneuse({ config, eclatement, onToucherPiece, onEtat, recentrer }: Props) {
  const conteneur = useRef<HTMLDivElement>(null)
  const scene3d = useRef<Scene3D | null>(null)
  const derniereConfig = useRef(config)
  const dernierEclatement = useRef(eclatement)
  const rappels = useRef({ onToucherPiece, onEtat })

  useEffect(() => {
    rappels.current = { onToucherPiece, onEtat }
  }, [onToucherPiece, onEtat])

  useEffect(() => {
    const hote = conteneur.current
    if (!hote) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      rappels.current.onEtat({ etat: 'erreur' })
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.setAttribute('aria-label', 'Montre en 3D : faire glisser pour tourner, pincer pour zoomer')
    hote.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const studio = creerStudio()
    scene.environment = pmrem.fromScene(studio, 0.02).texture
    studio.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      }
    })
    const cle = new THREE.DirectionalLight(0xffffff, 0.5)
    cle.position.set(-4, 8, 10)
    scene.add(cle)

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)
    // cadran face à nous, léger trois-quarts côté couronne ; le bracelet part en arrière
    const CIBLE = new THREE.Vector3(0, -0.3, -1.6)
    const DEPART = new THREE.Vector3(5.2, 2.6, 15.5)
    // vue éclatée : la caméra passe de trois-quarts à presque de profil, pour voir les pièces
    // s'écarter le long de l'axe du cadran (de face, elles s'écartent vers nous et on ne lit rien)
    const CIBLE_ECLATEE = new THREE.Vector3(0, -0.2, -1.5)
    const ECLATEE = new THREE.Vector3(17, 4.8, 4)
    const sphDepart = new THREE.Spherical().setFromVector3(DEPART.clone().sub(CIBLE))
    const sphEclatee = new THREE.Spherical().setFromVector3(ECLATEE.clone().sub(CIBLE_ECLATEE))
    const sph = new THREE.Spherical()
    let libre = false // l'utilisateur a tourné la montre : la caméra ne suit plus le curseur
    camera.position.copy(DEPART)

    const controles = new OrbitControls(camera, renderer.domElement)
    controles.target.copy(CIBLE)
    controles.enableDamping = true
    controles.dampingFactor = 0.08
    controles.enablePan = false
    controles.minDistance = 5
    controles.maxDistance = 24
    controles.update()
    controles.addEventListener('start', () => {
      libre = true
    })

    const matieres = creerMatieres()
    const racine = new THREE.Group()
    racine.rotation.x = Math.PI / 2 // modèle exporté cadran vers le haut : on le met face à la caméra
    scene.add(racine)

    const groupes = new Map<string, THREE.Object3D>()
    const variantes: { objet: THREE.Object3D; reglage: keyof Configuration; valeur: string }[] = []
    const heure3: THREE.Object3D[] = []
    let guichet: THREE.Object3D | null = null
    let loupe: THREE.Object3D | null = null
    let couronne: THREE.Object3D | null = null

    // ---- rendu à la demande
    let enCours = 0
    let animEclatement: { de: number; vers: number; debut: number } | null = null
    let eclatementCourant = dernierEclatement.current

    function poserEclatement(t: number) {
      eclatementCourant = t
      const e = t * t * (3 - 2 * t) // départ et arrivée en douceur
      groupes.forEach((g, nom) => {
        if (nom in ECARTS) g.position.y = ECARTS[nom] * e
      })
      if (couronne) couronne.position.x = ECART_COURONNE * e
      if (!libre) {
        sph.radius = sphDepart.radius + (sphEclatee.radius - sphDepart.radius) * e
        sph.phi = sphDepart.phi + (sphEclatee.phi - sphDepart.phi) * e
        sph.theta = sphDepart.theta + (sphEclatee.theta - sphDepart.theta) * e
        controles.target.lerpVectors(CIBLE, CIBLE_ECLATEE, e)
        camera.position.setFromSpherical(sph).add(controles.target)
        controles.update()
      }
    }

    function image(temps: number) {
      enCours = 0
      let encore = controles.update()
      if (animEclatement) {
        const k = Math.min(1, (temps - animEclatement.debut) / 450)
        poserEclatement(animEclatement.de + (animEclatement.vers - animEclatement.de) * k)
        if (k < 1) encore = true
        else animEclatement = null
      }
      renderer.render(scene, camera)
      if (encore) demander()
    }
    function demander() {
      if (!enCours) enCours = requestAnimationFrame(image)
    }
    controles.addEventListener('change', demander)

    function dimensionner() {
      const { clientWidth: l, clientHeight: h } = hote!
      if (!l || !h) return
      renderer.setSize(l, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = l / h
      // écran étroit (téléphone en portrait) : on recule pour garder toute la montre
      camera.fov = l / h < 0.9 ? 34 : 28
      camera.updateProjectionMatrix()
      demander()
    }
    const observateur = new ResizeObserver(dimensionner)
    observateur.observe(hote)
    dimensionner()

    // ---- toucher une pièce (clic sans glisser)
    const lanceur = new THREE.Raycaster()
    let appui: { x: number; y: number } | null = null
    function surAppui(e: PointerEvent) {
      appui = { x: e.clientX, y: e.clientY }
    }
    function surRelache(e: PointerEvent) {
      if (!appui || Math.hypot(e.clientX - appui.x, e.clientY - appui.y) > 6) return
      appui = null
      const r = renderer.domElement.getBoundingClientRect()
      lanceur.setFromCamera(
        new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1),
        camera,
      )
      const touche = lanceur.intersectObject(racine, true).find((i) => i.object.visible && estVisible(i.object))
      let o: THREE.Object3D | null = touche?.object ?? null
      while (o) {
        const piece = PIECE_DE_GROUPE[o.name]
        if (piece) {
          rappels.current.onToucherPiece(piece)
          return
        }
        o = o.parent
      }
    }
    function estVisible(o: THREE.Object3D) {
      for (let p: THREE.Object3D | null = o; p; p = p.parent) if (!p.visible) return false
      return true
    }
    renderer.domElement.addEventListener('pointerdown', surAppui)
    renderer.domElement.addEventListener('pointerup', surRelache)

    // ---- configuration
    function appliquerConfig(c: Configuration) {
      for (const v of variantes) v.objet.visible = c[v.reglage] === v.valeur
      const avecDate = c.date !== 'aucune'
      if (guichet) guichet.visible = avecDate
      if (loupe) loupe.visible = c.date === 'loupe'
      for (const o of heure3) o.visible = !avecDate
      teinterCadran(matieres, c)
      demander()
    }

    scene3d.current = {
      appliquerConfig,
      appliquerEclatement: (t) => {
        animEclatement = null
        poserEclatement(t)
        demander()
      },
      animerEclatement: (t) => {
        animEclatement = { de: eclatementCourant, vers: t, debut: performance.now() }
        demander()
      },
      recentrer: () => {
        libre = false
        poserEclatement(eclatementCourant)
        demander()
      },
    }

    // ---- chargement
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/') // décodeur WebAssembly servi par le site
    const chargeur = new GLTFLoader()
    chargeur.setDRACOLoader(draco)
    let annule = false
    rappels.current.onEtat({ etat: 'chargement', progression: 0 })
    chargeur.load(
      MODELE,
      (gltf) => {
        if (annule) return
        const montre = gltf.scene.getObjectByName('montre') ?? gltf.scene
        montre.traverse((o) => {
          if (o.parent === montre) groupes.set(o.name, o)
          if (o.name === 'couronne') couronne = o
          if (o.name === 'date_guichet') guichet = o
          if (o.name === 'date_loupe') loupe = o
          if (o.name.endsWith('_h3')) heure3.push(o)
          // nœud de variante « piece__variante » (les maillages qu'il contient ont des noms plus longs)
          const variante = /^([a-z]+)__([a-z]+)$/.exec(o.name)
          if (variante) variantes.push({ objet: o, reglage: variante[1] as keyof Configuration, valeur: variante[2] })
          const mesh = o as THREE.Mesh
          if (mesh.isMesh) {
            const nom = (mesh.material as THREE.Material).name as keyof Matieres
            ;(mesh.material as THREE.Material).dispose()
            mesh.material = o.name === 'boitier_rehaut' ? matieres.rehaut : matieres[nom] ?? matieres.acier_poli
          }
        })
        racine.add(gltf.scene)
        appliquerConfig(derniereConfig.current)
        poserEclatement(dernierEclatement.current)
        rappels.current.onEtat({ etat: 'pret' })
        demander()
      },
      (ev) => {
        if (ev.total) rappels.current.onEtat({ etat: 'chargement', progression: ev.loaded / ev.total })
      },
      () => {
        if (!annule) rappels.current.onEtat({ etat: 'erreur' })
      },
    )

    return () => {
      annule = true
      scene3d.current = null
      observateur.disconnect()
      cancelAnimationFrame(enCours)
      controles.dispose()
      renderer.domElement.removeEventListener('pointerdown', surAppui)
      renderer.domElement.removeEventListener('pointerup', surRelache)
      draco.dispose()
      racine.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) mesh.geometry.dispose()
      })
      Object.values(matieres).forEach((m) => m.dispose())
      scene.environment?.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  useEffect(() => {
    derniereConfig.current = config
    scene3d.current?.appliquerConfig(config)
  }, [config])

  useEffect(() => {
    const precedent = dernierEclatement.current
    dernierEclatement.current = eclatement
    const s = scene3d.current
    if (!s) return
    // un grand saut (bouton, clic sur la piste) s'anime ; le glissé suit le doigt
    if (Math.abs(eclatement - precedent) > 0.2) s.animerEclatement(eclatement)
    else s.appliquerEclatement(eclatement)
  }, [eclatement])

  useEffect(() => {
    if (recentrer) scene3d.current?.recentrer()
  }, [recentrer])

  return <div ref={conteneur} className="absolute inset-0" />
}
