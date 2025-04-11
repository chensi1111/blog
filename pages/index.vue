<template>
  <TheHeader></TheHeader>
  <div class="container" id="index">
    <div ref="sceneRef" class="three-container">
      <div class="logo"><img src="/img/logo.png" alt="">
        <div class="icon play" @click="videoPlaying=true" v-show="!videoPlaying && loadingPercent > 99.9"><el-icon><VideoPlay /></el-icon></div>
        <div class="icon pause" @click="videoPlaying=false" v-show="videoPlaying && loadingPercent > 99.9"><el-icon><VideoPause /></el-icon></div>
      </div>
      <div class="loadingWrapper" v-if="loadingPercent < 100">
        <div class="loadingBar" :style="{ width: `${loadingPercent}%` }"></div>
        <div class="loadingText">{{ loadingPercent.toFixed(1) }}%</div>
      </div>
    </div>
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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import {VideoPause,VideoPlay} from '@element-plus/icons-vue'

const videoPlaying = ref(false);

const sceneRef = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer;
let deskModel: THREE.Object3D | null = null;
// let controls: OrbitControls;

let raycaster: THREE.Raycaster;
let mouse: THREE.Vector2;

let mixer: THREE.AnimationMixer;
let actionChair:THREE.AnimationAction
let actionChairPlaying=false
let isChairAnimating = false;

let actionComputer:THREE.AnimationAction
let actionComputerPlaying=false
let isComputerAnimating = false;

let actionCabinet1:THREE.AnimationAction
let actionCabinet2:THREE.AnimationAction
let actionCabinet3:THREE.AnimationAction
let actionCabinet4:THREE.AnimationAction
let actionCabinets:THREE.AnimationAction[]
let actionCabinetPlaying=false
let isCabinetAnimating = false;

const gltfLoader = new GLTFLoader();
const loadingPercent = ref(0);
function loadGLTF() {
  if (deskModel) return;
  gltfLoader.load(
  "/blog/home.glb", 
  (gltf) => {
    deskModel = gltf.scene;
    deskModel.position.set(0, -8.4, 74); 
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
    actionCabinets = [actionCabinet1, actionCabinet2, actionCabinet3, actionCabinet4];
    actionCabinets.forEach(action => {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true; 
    });

  },
    (xhr) => {
      if (xhr.total) {
      loadingPercent.value = (xhr.loaded / xhr.total) * 100;
    }
    },
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

  loadGLTF()
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(-300, 100, 50);
  scene.add(light);
  const light2 = new THREE.AmbientLight(0xffffff,3)
  scene.add(light2)
  // controls = new OrbitControls(camera, renderer.domElement);
  requestAnimationFrame(animate);
  window.addEventListener('click',handleClickOrTouch)
  window.addEventListener('touchstart', handleClickOrTouch)
  window.addEventListener('mousemove',onMouseMove)
}

function animate() {
  requestAnimationFrame(animate)
  if (deskModel) {
    if(videoPlaying.value){
      deskModel.rotation.y += 0.005;
    }
    mixer.update(0.01);
  }
  render();
}

function getEventCoords(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  let clientX = 0;
  let clientY = 0;

  if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else if (event instanceof TouchEvent && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  }

  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: -((clientY - rect.top) / rect.height) * 2 + 1,
  };
}

function handleClickOrTouch(event: MouseEvent | TouchEvent) {
  const { x, y } = getEventCoords(event, renderer.domElement);
  mouse.x = x;
  mouse.y = y;
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
  const { x, y } = getEventCoords(event, renderer.domElement);
  mouse.x = x;
  mouse.y = y;
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

onMounted(() => {
  init();
  window.addEventListener("resize", onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("click", handleClickOrTouch);
  window.removeEventListener("touchstart", handleClickOrTouch);
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
  position: relative;
  overflow: hidden;
}
.logo{
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  max-width: 600px;
}
.logo img{
  width: 100%;
  height: auto;
}
.icon{
  position: absolute;
  color: white;
  font-size: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon:hover{
  cursor: pointer;
}
.icon.play{
  background: linear-gradient(
    to bottom,
    rgb(0, 180, 0),
    rgb(0, 100, 0),
    rgb(0, 180, 0)
  );
}
.icon.pause{
  background: linear-gradient(
    to bottom,
    rgb(220, 0, 0),
    rgb(120, 0, 0),
    rgb(220, 0, 0)
  );
}
.loadingWrapper{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 25px;
  border:1px solid white;
}
.loadingBar {
  height: 100%;
  background-color: #42b883; 
  transition: width 0.2s ease;
}
.loadingText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}
@media screen and (max-width: 1024px){
  .three-container {
    height: 80vh;
  }
  .icon{
    font-size: 40px;
    width: 50px;
    height: 50px;
  }
}
@media screen and (max-width: 768px){
  .three-container {
    height: 70vh;
  }
  .icon{
    font-size: 30px;
    width: 40px;
    height: 40px;
  }
  .logo{
    top: 30%;
    transform: translate(-50%, -30%);
  }
  .loadingWrapper{
    width: 200px;
    height: 20px;
  }
  
}
@media screen and (max-width: 600px){
  .three-container {
    height: 50vh;
  }
}
@media screen and (max-width: 414px){
  .three-container {
    height: 40vh;
  }
  .logo{
    top: 33%;
    transform: translate(-50%, -33%);
  }
  .icon{
    font-size: 15px;
    width: 25px;
    height: 25px;
  }
  .loadingWrapper{
    width: 150px;
    height: 15px;
  }
  .loadingText{
    font-size: 12px;
  }
  
}
</style>
