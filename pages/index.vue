<template>
  <TheHeader></TheHeader>
  <div class="container" id="index">
    <div ref="sceneRef" class="three-container"></div>
  <about id="about"></about>
  <experience  id="experience"></experience>
  <skill id="skill"></skill>
  <project id="project"></project>
  <ScrollTop></ScrollTop>
  <theFooter></theFooter>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const sceneRef = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer;
let textOffset:number
let textWidth:number
let text1Size:number
let text2Size:number
// let controls: OrbitControls;
let meshes:any
let mixer:any
let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;
let intersects: any[];
let chairGroup:any
let deskModel: THREE.Object3D | null = null;
let actionChair:THREE.AnimationAction
let actionChairPlaying=false
let actionComputer:THREE.AnimationAction
let actionComputerPlaying=false
let actionCabinet1:THREE.AnimationAction
let actionCabinet2:THREE.AnimationAction
let actionCabinet3:THREE.AnimationAction
let actionCabinet4:THREE.AnimationAction
let actionCabinets:THREE.AnimationAction[]
let actionCabinetPlaying=false
let isChairAnimating = false;
let isComputerAnimating = false;
let isCabinetAnimating = false;

const gltfLoader = new GLTFLoader();
function loadGLTF() {
  if (deskModel) return;
  const gui=new GUI()
  gltfLoader.load(
  "/home2.glb", 
  (gltf) => {
    deskModel = gltf.scene;
    deskModel.position.set(0, -8.4, 74); 
    deskModel.rotation.set(0, 1, 0);
    scene.add(deskModel);
    mixer=  new THREE.AnimationMixer(deskModel)
    mixer.addEventListener('finished', (event:any) => {
        if (event.action === actionChair) {
          isChairAnimating = false;
        }
        if (event.action === actionComputer) {
          isComputerAnimating = false;
        }
        if (event.action === actionCabinet1) {
          isCabinetAnimating = false;
        }
      });
    actionChair = mixer.clipAction(gltf.animations[0]);
    actionChair.setLoop(THREE.LoopOnce, 1); 
    actionChair.clampWhenFinished = true; 

    actionComputer = mixer.clipAction(gltf.animations[35]);
    actionComputer.setLoop(THREE.LoopOnce, 1); 
    actionComputer.clampWhenFinished = true; 

    actionCabinet1 = mixer.clipAction(gltf.animations[36]);
    actionCabinet2 = mixer.clipAction(gltf.animations[37]);
    actionCabinet3 = mixer.clipAction(gltf.animations[38]);
    actionCabinet4 = mixer.clipAction(gltf.animations[39]);
    actionCabinets = [actionCabinet1, actionCabinet2, actionCabinet2, actionCabinet4];
    actionCabinets.forEach(action => {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true; 
    });

  }
);
}

function init() {
  if (!sceneRef.value) return;
  scene = new THREE.Scene();
  const width = sceneRef.value.clientWidth;
  const height = sceneRef.value.clientHeight;
   const fov = 75; 
  const aspect = width / height; 
  const near = 0.005; 
  const far = 2000; 
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0); 

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  sceneRef.value.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  raycaster.far = Infinity;

  const gui = new GUI();
  loadGLTF()
  // initTextSize()
  // const loader = new FontLoader();
  // loader.load("/blog/font/gentilis_bold.typeface.json", async (font) => {
  //   const text = "Hello,I'm Andy";
  //   const text2 = "A Frontend Developer";
  //   // const gui = new GUI();

  //   const material = new THREE.MeshStandardMaterial({
  //     color: 0xffffff,
  //     metalness: 0.5,
  //     roughness: 0.5,
  //   });

  //   const material2 = new THREE.MeshStandardMaterial({
  //     color: 0x32cd32,
  //     metalness: 0.5,
  //     roughness: 0.5,
  //   });

  //   async function createText(
  //     text: string,
  //     material: THREE.MeshStandardMaterial,
  //     size: number,
  //     yOffset :number
  //   ) {
  //     meshes = [];

  //     for (let i = 0; i < text.length; i++) {
  //       const char = text[i];
  //       if (char === " ") {
  //         meshes.push({ mesh: null, width: textWidth });
  //         continue;
  //       }

  //       const geometry = new TextGeometry(char, {
  //         font: font,
  //         size: size,
  //         depth:5,
  //         bevelThickness: 2,
  //         bevelSize: 1.5,
  //         bevelEnabled: true,
  //       });

  //       geometry.computeBoundingBox();
  //       const boundingBox = geometry.boundingBox;
  //       if (!boundingBox) continue;

  //       const charWidth = boundingBox.max.x - boundingBox.min.x;
  //       const mesh = new THREE.Mesh(geometry, material);
  //       mesh.rotateX(0.15);
  //       mesh.position.z = 0;
  //       mesh.position.y = yOffset;

  //       scene.add(mesh);
  //       meshes.push({ mesh, width: charWidth });

  //       // 計算總寬度，確保文字置中
  //       let totalWidth = meshes.reduce((sum:any, obj:any) => sum + obj.width, 0);
  //       let centerOffset = totalWidth / 2;

  //       // 重新排列所有字母的位置，使其置中
  //       let offsetX = -centerOffset;
  //       for (let j = 0; j < meshes.length; j++) {
  //         if (meshes[j].mesh) {
  //           meshes[j].mesh!.position.x = offsetX;
  //         }
  //         offsetX += meshes[j].width;
  //       }

  //       await new Promise((resolve) => setTimeout(resolve, 75));
  //     }
  //   }

  //   await createText(text, material, text1Size,120);
  //   await createText(text2, material2, text2Size, 60);
  // });

  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(-300, 100, 50);
  scene.add(light);
  const light2 = new THREE.AmbientLight(0xffffff,3)
  scene.add(light2)
  // controls = new OrbitControls(camera, renderer.domElement);
  requestAnimationFrame(animate);
  window.addEventListener('click',onMouseClick)
  window.addEventListener('mousemove',onMouseMove)
}

function animate() {
  requestAnimationFrame(animate)
  if (deskModel) {
    deskModel.rotation.y += 0.001;
    mixer.update(0.01);
  }
  render();
}

function onMouseClick(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if(!deskModel)return
  const intersects = raycaster.intersectObject(deskModel, true);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object.name;
    if(selectedObject==='chairBox'){
      toggleChairAnimation();
    }else if(selectedObject==='computerBox'){
      toggleComputerAnimation()
    }else if(selectedObject==='cabinetBox'){
      toggleCabinetAnimation()
    }
  }
}

function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if(!deskModel)return
  const intersects = raycaster.intersectObject(deskModel, true);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object.name;
    if (selectedObject === 'chairBox' || selectedObject === 'computerBox' || selectedObject === 'cabinetBox') {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  } else {
    document.body.style.cursor = 'auto';
  }
}

function toggleChairAnimation() {
  if (isChairAnimating) return; 

  isChairAnimating = true; 
  const clipDuration = actionChair.getClip().duration;

  if (!actionChairPlaying) {
    actionChair.timeScale = 1;
    actionChair.reset();
    actionChair.play();
    actionChairPlaying = true;
  } else {
    actionChair.timeScale = -1;
    actionChair.reset();
    actionChair.play();
    actionChair.time = clipDuration; // 重設時間到最後
    actionChairPlaying = false;
  }
}

function toggleComputerAnimation() {
  if (isComputerAnimating) return; 

  isComputerAnimating = true; 
  const clipDuration = actionComputer.getClip().duration;

  if (!actionComputerPlaying) {
    actionComputer.timeScale = 1;
    actionComputer.reset();
    actionComputer.play();
    actionComputerPlaying = true;
  } else {
    actionComputer.timeScale = -1;
    actionComputer.reset();
    actionComputer.play();
    actionComputer.time = clipDuration; // 重設時間到最後
    actionComputerPlaying = false;
  }
}

function toggleCabinetAnimation() {
  if (isCabinetAnimating) return; 

  isCabinetAnimating = true; 
  const clipDuration = actionCabinet1.getClip().duration;

  if (!actionCabinetPlaying) {
    actionCabinets.forEach((action) => {
      action.timeScale = 1;
      action.reset();
      action.play();
    });
    actionCabinetPlaying = true;
  } else {
    actionCabinets.forEach((action) => {
      action.timeScale = -1;
      action.reset();
      action.play();
      action.time = clipDuration;
    });
    actionCabinetPlaying = false;
  }
}


function render() {
  renderer.render(scene, camera);
}
function onWindowResize() {
  if (!sceneRef.value || !camera || !renderer) return;

  const width = sceneRef.value.clientWidth;
  const height = sceneRef.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function initTextSize() {
  if(window.innerWidth < 414){
    textOffset = -30
    textWidth = 5;
    text1Size = 30;
    text2Size = 10;
  } else if (window.innerWidth < 768) {
    textOffset = -50
    textWidth = 5;
    text1Size = 40;
    text2Size = 20;
  } else if (window.innerWidth < 1024) {
    textOffset = -80
    textWidth = 15;
    text1Size = 70;
    text2Size = 50;
  } else {
    textWidth = 20;
    textOffset = -100
    text1Size = 70;
    text2Size = 40;
  }
}

onMounted(() => {
  init();
  window.addEventListener("resize", onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("click", onMouseClick);
  window.removeEventListener('mousemove',onMouseMove)

});
</script>

<style scoped>
.container{
  background-color: black;
  overflow: hidden;
}
.three-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
@media screen and (max-width: 1024px){
  .three-container {
    height: 80vh;
  }
}
@media screen and (max-width: 768px){
  .three-container {
    height: 70vh;
  }
  
}
</style>
