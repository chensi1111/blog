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
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const running=ref(true)
const sceneRef = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let group: THREE.Group;
const particlesData = [] as any; // 存放所有粒子的資料
let positions: Float32Array; // 線條的位置
let colors: Float32Array; // 線條的顏色
let particles: THREE.BufferGeometry; // 用來存放粒子
let pointCloud: THREE.Points; // 實際的粒子
let particleColors: Float32Array; // 粒子顏色
let particlePositions: Float32Array; // 粒子位置
let linesMesh: THREE.LineSegments; // 連接粒子的線條
let speedFactor: number; // 粒子移動速度
let mouseCircle: THREE.Mesh; // 鼠標圓圈
let circleX: any; // 圓心 x 座標
let circleY: any; // 圓心 y 座標
let circleRadius :number; // 圓半徑
let meshes:any
let textOffset:number
let textWidth:number
let text1Size:number
let text2Size:number
// let controls: OrbitControls;

//粒子控制變數
const maxParticleCount = 150;
let particleCount = 100;
const r = 300;
const rHalf = r / 2;

const effectController = {
  minDistance: 200,
  maxConnections: 30,
  particleCount: 100,
};

// function initGUI(){
//     const gui = new GUI();
//     gui.add(effectController, "minDistance", 10, 300);
// 	gui.add( effectController, 'maxConnections', 0, 30, 1 );
// 	gui.add( effectController, 'particleCount', 0, maxParticleCount, 1 ).onChange( function ( value ) {
// 		particleCount = value;
// 		particles.setDrawRange( 0, particleCount );
// 	} );
// }

function init() {
  if (!sceneRef.value) return;
  // initGUI();
  scene = new THREE.Scene();
  const width = sceneRef.value.clientWidth;
  const height = sceneRef.value.clientHeight;
  camera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0.1,
    1000
  );
  camera.position.z = 500;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight);
  sceneRef.value.appendChild(renderer.domElement);

  initTextSize()
  const loader = new FontLoader();
  loader.load("/blog/font/gentilis_bold.typeface.json", async (font) => {
    const text = "Hello,I'm Andy";
    const text2 = "A Frontend Developer";
    // const gui = new GUI();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.5,
    });

    const material2 = new THREE.MeshStandardMaterial({
      color: 0x32cd32,
      metalness: 0.5,
      roughness: 0.5,
    });

    async function createText(
      text: string,
      material: THREE.MeshStandardMaterial,
      size: number,
      yOffset = 0
    ) {
      meshes = [];

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === " ") {
          meshes.push({ mesh: null, width: textWidth });
          continue;
        }

        const geometry = new TextGeometry(char, {
          font: font,
          size: size,
          depth: 20,
          bevelThickness: 2,
          bevelSize: 1.5,
          bevelEnabled: true,
        });

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        if (!boundingBox) continue;

        const charWidth = boundingBox.max.x - boundingBox.min.x;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(0.18);
        mesh.position.z = rHalf + 10;
        mesh.position.y = yOffset;

        scene.add(mesh);
        meshes.push({ mesh, width: charWidth });

        // 計算總寬度，確保文字置中
        let totalWidth = meshes.reduce((sum:any, obj:any) => sum + obj.width, 0);
        let centerOffset = totalWidth / 2;

        // 重新排列所有字母的位置，使其置中
        let offsetX = -centerOffset;
        for (let j = 0; j < meshes.length; j++) {
          if (meshes[j].mesh) {
            meshes[j].mesh!.position.x = offsetX;
          }
          offsetX += meshes[j].width;
        }

        await new Promise((resolve) => setTimeout(resolve, 75));
      }
    }

    await createText(text, material, text1Size);
    await createText(text2, material2, text2Size, textOffset);
  });

  const light = new THREE.DirectionalLight(0xffffff, 20);
  light.position.set(-300, 100, 50);
  scene.add(light);
  // controls = new OrbitControls(camera, renderer.domElement);
  group = new THREE.Group();
  scene.add(group);

  // 鼠標圓形
  initCircleSize()
  const circleGeometry = new THREE.CircleGeometry(circleRadius, 32);
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0,
    transparent: true,
    depthWrite: false,
  });
  mouseCircle = new THREE.Mesh(circleGeometry, circleMaterial);
  scene.add(mouseCircle);

  const segments = maxParticleCount * maxParticleCount;
  positions = new Float32Array(segments * 3);
  colors = new Float32Array(segments * 3);

  // 粒子材質
  const pMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 5,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false,
  });
  
  particles = new THREE.BufferGeometry();
  particlePositions = new Float32Array(maxParticleCount * 3);
  particleColors = new Float32Array(maxParticleCount * 3);

  changeParticleCount();
  // 粒子移動速度
  initSpeedFactor()
  
  const boundary = getBoundary();
  if (!boundary) return;

  for (let i = 0; i < maxParticleCount; i++) {
    // 粒子位置
    const boundaryOffset = 5;
    const x =
      Math.random() * (boundary.x - 2 * boundaryOffset) -
      boundary.x / 2 -
      boundaryOffset;
    const y =
      Math.random() * (boundary.y - 2 * boundaryOffset) -
      boundary.y / 2 -
      boundaryOffset;
    const z = Math.random() * r - r / 2;
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // 粒子顏色
    const colorFactor = (z + rHalf) / (r * 0.5);
    particleColors[i * 3] = colorFactor; // R
    particleColors[i * 3 + 1] = 1.0 - colorFactor; // G
    particleColors[i * 3 + 2] = 0.5 + 0.5 * Math.sin(colorFactor * Math.PI); // B

    
    // 避免速度為0
    function getNonZeroVelocity() {
      let velocity = (-1 + Math.random() * 2) * speedFactor;
      if (velocity === 0) {
        return getNonZeroVelocity();
      }
      return velocity;
    }
    particlesData.push({
      velocity: new THREE.Vector3(
        getNonZeroVelocity(),
        getNonZeroVelocity(),
        getNonZeroVelocity()
      ),
      numConnections: 0,
    });
  }
  particles.setDrawRange(0, particleCount); //粒子渲染範圍
  // setUsage(THREE.DynamicDrawUsage) 使粒子的位置與顏色可以動態更新
  particles.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );
  particles.setAttribute(
    "color",
    new THREE.BufferAttribute(particleColors, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  pointCloud = new THREE.Points(particles, pMaterial);
  group.add(pointCloud);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
  );
  geometry.computeBoundingSphere();
  geometry.setDrawRange(0, 0);

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
  });

  linesMesh = new THREE.LineSegments(geometry, material);
  group.add(linesMesh);

  //   const helper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(boundary.x,boundary.y,r)));
  //   helper.material.color.set(0x474747);
  //   helper.material.blending = THREE.AdditiveBlending;
  //   helper.material.transparent = true;
  //   group.add(helper);
  requestAnimationFrame(animate);
}

let lastTime = 0;  
const fps = 24; 
const fpsInterval = 1000 / fps; 
function animate(time: number) {
  if (!running) return;
  
  requestAnimationFrame(animate);

  const deltaTime = time - lastTime; // 計算幀與幀之間的時間間隔
  if (deltaTime > fpsInterval) { 
    lastTime = time - (deltaTime % fpsInterval); // 更新最後一次動畫的時間

  let vertexpos = 0;
  let colorpos = 0;
  let numConnected = 0;
  const boundary = getBoundary();
  if (!boundary) return;
  for (let i = 0; i < particleCount; i++) {
    particlesData[i].numConnections = 0;

    for (let i = 0; i < particleCount; i++) {
      const particleData = particlesData[i];
      const boundSpeed = 0.005;
      // 限制粒子移動範圍
      if (
        particlePositions[i * 3] <= -boundary.x / 2 ||
        particlePositions[i * 3] >= boundary.x / 2
      ) {
        particleData.velocity.x =
          -particleData.velocity.x ||
          boundSpeed * Math.sign(particleData.velocity.x);
      }
      if (
        particlePositions[i * 3 + 1] <= -boundary.y / 2 ||
        particlePositions[i * 3 + 1] >= boundary.y / 2
      ) {
        particleData.velocity.y =
          -particleData.velocity.y ||
          boundSpeed * Math.sign(particleData.velocity.y);
      }
      if (
        particlePositions[i * 3 + 2] <= -rHalf ||
        particlePositions[i * 3 + 2] >= rHalf
      ) {
        particleData.velocity.z = -particleData.velocity.z;
      }
      // 粒子移動
      particlePositions[i * 3] += particleData.velocity.x;
      particlePositions[i * 3 + 1] += particleData.velocity.y;
      particlePositions[i * 3 + 2] += particleData.velocity.z;

      // 檢查是否進入圓形範圍並推開
      const px = particlePositions[i * 3];
      const py = particlePositions[i * 3 + 1];

      const dx = px - circleX;
      const dy = py - circleY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < circleRadius) {
        const pushStrength = 0.2;
        const nx = dx / distance;
        const ny = dy / distance;

        // 紀錄初始速度
        if (!particleData.initialVelocity) {
          particleData.initialVelocity = {
            x: particleData.velocity.x,
            y: particleData.velocity.y,
          };
        }
        // 施加推力
        if (circleX != null && circleY != null) {
          particleData.velocity.x = nx * pushStrength;
          particleData.velocity.y = ny * pushStrength;
        }
      } else if (particleData.initialVelocity) {
        // 逐步回復初始速度
        const recoveryFactor = 0.1;
        particleData.velocity.x = lerp(
          particleData.velocity.x,
          particleData.initialVelocity.x,
          recoveryFactor
        );
        particleData.velocity.y = lerp(
          particleData.velocity.y,
          particleData.initialVelocity.y,
          recoveryFactor
        );
      }

      const minSpeed = 0.001; // 設定最小速度閾值，避免變成 0
      if (Math.abs(particleData.velocity.x) < minSpeed) {
        particleData.velocity.x = Math.sign(particleData.velocity.x) * minSpeed;
      }
      if (Math.abs(particleData.velocity.y) < minSpeed) {
        particleData.velocity.y = Math.sign(particleData.velocity.y) * minSpeed;
      }
      // 粒子顏色
      const z = particlePositions[i * 3 + 2];
      const colorFactor = (z + rHalf) / (r * 0.5);
      particleColors[i * 3] = colorFactor; // R
      particleColors[i * 3 + 1] = 1.0 - colorFactor; // G
      particleColors[i * 3 + 2] = 0.5 + 0.5 * Math.sin(colorFactor * Math.PI); // B

      if (particleData.numConnections >= effectController.maxConnections)
        continue;

      for (let j = i + 1; j < particleCount; j++) {
        const particleDataB = particlesData[j]; // 後一個粒子
        if (particleDataB.numConnections >= effectController.maxConnections)
          continue;
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz); // 記算兩點距離

        if (dist < effectController.minDistance) {
          particleData.numConnections++;
          particleDataB.numConnections++;

          const alpha = 0.5 * (1 - dist / effectController.minDistance);

          // 分別設置兩個粒子的位置與顏色
          positions[vertexpos++] = particlePositions[i * 3];
          positions[vertexpos++] = particlePositions[i * 3 + 1];
          positions[vertexpos++] = particlePositions[i * 3 + 2];

          positions[vertexpos++] = particlePositions[j * 3];
          positions[vertexpos++] = particlePositions[j * 3 + 1];
          positions[vertexpos++] = particlePositions[j * 3 + 2];

          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;

          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;
          colors[colorpos++] = alpha;

          numConnected++;
        }
      }
    }
    linesMesh.geometry.setDrawRange(0, numConnected * 2); // 兩個點之間連線
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;

    pointCloud.geometry.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;

    render();
  }
}
}
function getBoundary() {
  if (sceneRef.value) {
    const width = sceneRef.value.clientWidth;
    const height = sceneRef.value.clientHeight;
    return { x: width, y: height };
  }
}
function render() {
  renderer.render(scene, camera);
}
function onWindowResize() {
  if (!sceneRef.value || !camera || !renderer) return;
  changeParticleCount()

  const width = sceneRef.value.clientWidth;
  const height = sceneRef.value.clientHeight;

  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneRef.value.clientWidth, sceneRef.value.clientHeight);
}
function onMouseMove(event: MouseEvent | TouchEvent) {
  if (!sceneRef.value || !mouseCircle) return;
   // 區分mouse和touch
   const isTouchEvent = event instanceof TouchEvent;
   let clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
   let clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

  const rect = sceneRef.value.getBoundingClientRect();
  const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
  const mouseVector = new THREE.Vector3(mouseX, mouseY, 0);
  mouseVector.unproject(camera);

  mouseCircle.position.set(mouseVector.x, mouseVector.y, 0);
  circleX = mouseVector.x;
  circleY = mouseVector.y;
}

function onMouseLeave() {
  if (mouseCircle) {
    scene.remove(mouseCircle);
    circleX = null;
    circleY = null;
  }
}

function onMouseEnter() {
  if (mouseCircle) {
    scene.add(mouseCircle);
  }
}
function lerp(start: any, end: any, t: any) {
  return start * (1 - t) + end * t;
}

function handleSceneIntersect(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    // 當 intersectionRatio 為 0，代表目標元素完全離開視窗
    if (entry.intersectionRatio > 0) {
      running.value = true;
    } else {
      running.value = false;
    }
  });
}
function changeParticleCount() {
  if (window.innerWidth < 768) {
    particleCount = 40;
  } else if (window.innerWidth < 1024) {
    particleCount = 60;
  } else {
    particleCount = 100;
  }
  
  particles.setDrawRange(0, particleCount);
}

function initSpeedFactor() {
  if (window.innerWidth > 768) {
    speedFactor = 0.004;
  } else {
    speedFactor = 0.012;
  }
}
function initCircleSize(){
  if(window.innerWidth < 768){
    circleRadius = 50;
  }else{
    circleRadius = 100;
  }
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
    text1Size = 90;
    text2Size = 70;
  }
}

onMounted(() => {
  init();
  window.addEventListener("resize", onWindowResize);
  if (sceneRef.value) {
    sceneRef.value.addEventListener("mousemove", onMouseMove);
    sceneRef.value.addEventListener("mouseleave", onMouseLeave);
    sceneRef.value.addEventListener("mouseenter", onMouseEnter);
    // touch event
    sceneRef.value.addEventListener("touchmove", onMouseMove);
    sceneRef.value.addEventListener("touchend", onMouseLeave);
    sceneRef.value.addEventListener("touchstart", onMouseEnter);
  }
  // 監控Scene變化
  const observer = new IntersectionObserver(handleSceneIntersect, {
    root: null, // 相對於 viewport
    threshold: [0] // 只在從 0% 變化時觸發
  });
  if (sceneRef.value) {
    observer.observe(sceneRef.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  if (sceneRef.value) {
    sceneRef.value.removeEventListener("mousemove", onMouseMove);
    sceneRef.value.removeEventListener("mouseleave", onMouseLeave);
    sceneRef.value.removeEventListener("mouseenter", onMouseEnter);
    // touch event
    sceneRef.value.removeEventListener("touchmove", onMouseMove);
    sceneRef.value.removeEventListener("touchend", onMouseLeave);
    sceneRef.value.removeEventListener("touchstart", onMouseEnter);
  }
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
