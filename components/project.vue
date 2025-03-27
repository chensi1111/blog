<template>
  <div class="projectContainer">
    <div class="title" ref="titleRef" :class="{ move: titleMove }">專案</div>
    <div class="projects">
      <div class="project" v-for="project in projects" :key="project.name">
        <div class="pic">
          <div class="pin" v-if="project.pin"><img src="/img/pin.png"></div>
          <div class="web" :style="{backgroundImage:`url(${project.web})`}"></div>
          <div class="phone" :style="{backgroundImage:`url(${project.phone})`}"></div>
        </div>
        <div class="infos">
            <div class="info">
                <div class="name">
                    <span>{{ project.name }}</span>
                    <div class="time">{{ project.time }}</div>
                </div>
                <div class="skills">
                    <div v-for="skill in project.skill">
                    <div class="skill">{{ skill }}</div>
                </div>
                </div>
                <div class="introduce">{{ project.introduce }}</div>
                <div class="buttons">
                <a class="button" :href="project.github" target="_blank"><img src="/img/githubLogo.png"></a>
                <a class="button" :href="project.link" target="_blank"><img src="/img/link.png"></a>
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const titleRef = ref<HTMLDivElement>();
const titleMove = ref(false);

const projects = ref([
  { name: t('project.content.0.name'),time:'Apr 2025',skill:['Nuxt3','TypeScript','ThreeJs'],introduce:t('project.content.0.introduce'),pin:true,web:'/img/blogWeb.png'},
  { name: t('project.content.1.name'),time:'Mon 2025',skill:['Vue3','TypeScript','Three.js'],introduce:t('project.content.1.introduce'),web:'/img/birthdayWeb.png',phone:'/img/birthdayPhone.jpg' ,link:'https://chensi1111.github.io/birthday/#/範例/範例禮物',github:'https://github.com/chensi1111/birthday'},
  { name: t('project.content.2.name'),time:'Aug 2024',skill:['Nuxt3','TypeScript','Tailwind CSS'],introduce:t('project.content.2.introduce'),web:'/img/weatherWeb.png',phone:'/img/weatherPhone.jpg' ,link:'https://chensi1111.github.io/MyWeather/',github:'https://github.com/chensi1111/MyWeather'},
  { name: t('project.content.3.name'),time:'Jul 2024',skill:['Vue3','TypeScript','Firebase'],introduce:t('project.content.3.introduce'),web:'/img/shoppingWeb.png' ,phone:'/img/shoppingPhone.jpg' ,link:'https://chensi1111.github.io/Elysian-MiragO/',github:'https://github.com/chensi1111/Elysian-MiragO'},
  { name: t('project.content.4.name'),time:'May 2024',skill:['Vue3','JavaScript','Firebase'],introduce:t('project.content.4.introduce'),web:'/img/hotelWeb.png' ,phone:'/img/hotelPhone.jpg' ,link:'https://github.com/chensi1111/DawnHotel',github:'https://chensi1111.github.io/DawnHotel/'},
]);

function handleIntersect(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    const isVisible = entry.isIntersecting;
    if (entry.target === titleRef.value) {
      titleMove.value = isVisible;
    }
  });
}

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: "0px 0px -200px 0px",
    threshold: 0,
  });

  if (titleRef.value) {
    observer.observe(titleRef.value);
  }
});
</script>
<style scoped>
/* * {
  border: 1px solid red;
} */
.projectContainer {
  color: white;
  padding: 20px 0;
  width: 60%;
  margin: 0 auto;
}
.title {
  letter-spacing: 8px;
  font-size: 35px;
  margin-bottom: 25px;
  font-weight: bold;
  transform: translateX(30%);
  opacity: 0;
  transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}

.move {
  transform: translateX(0);
  opacity: 1;
}
.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.project {
  width: calc(50% - 10px);
  min-height: 300px;
  border-radius: 20px;
  padding: 10px;
  border: 1px solid gray;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgb(50,50,50), rgb(30,30,30),rgb(50,50,50));
  transition: transform 0.3s ease-in-out, border 0.3s ease-in-out;
}
.project:hover {
  cursor: pointer;
  animation: borderColorAnimation 4s infinite;
  transform: translate(0, -10px);
}

.project:hover .buttons {
  transform: translateY(0);
  opacity: 1;
}
.pic{
    border: 1px solid black;
    height: 150px;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    position: relative;
}
.pin{
  position: absolute;
  top: 5px;
  right: 5px;
}
.web{
  width: 75%;
  height: 100%;
  background-size: cover;
  background-position: left;
  border-right: 3px solid black;
}
.phone{
  width: 25%;
  height: 100%;
  background-size: cover;
  background-position: left;
}
.infos{
    display: flex;
    padding: 0 20px;
}
.info{
    width: 100%;
    margin-top: 20px;
    position: relative;
}
.name{
    font-size: 18px;
    font-weight: bold;
    display: flex;
}
.name span{
    margin-right: 10px;
}
.time{
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:rgb(170, 170, 170)
}
.skills{
    font-size: 14px;
    color: rgb(170, 170, 170);
    margin-top: 10px;
    display: flex;
}
.skill{
    margin-right: 10px
}
.introduce{
    font-size: 14px;
    color: white;
    margin-top: 10px;
}
.buttons{
    position:absolute ;
    top: 0;
    right: 0;
    display: flex;
    transform: translateY(25px);
    opacity: 0;
    transition: 0.5s ease-in-out;
}
.button{
    background-color: gray;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
}
.button:hover{
    background-color: white;
}
img{
    width: 20px;
    height: 20px;
}
@keyframes borderColorAnimation {
  0% {
    border-color: rgb(255, 102, 255);
  }
  50% {
    border-color: rgb(255, 56, 62);
  }
  100% {
    border-color: rgb(255, 102, 255);
  }
}
@media screen and (max-width: 1200px){
    .projectContainer{
        width: 70%;
    }
    
}
@media screen and (max-width: 1024px){
    .projectContainer{
        width: 85%;
    }
    .title{
      font-size: 30px;
    }
    .button{
        width: 25px;
        height: 25px;
    }
  
}
@media screen and (max-width: 768px){
    .projectContainer{
        width: 90%;
    }
    .title{
      font-size: 25px;
      margin-bottom: 15px;
    }
    .projects{
      gap: 0;
    }
    .project{
      width: 100%;
      margin-bottom: 20px;
    }
    .infos{
      padding: 0 10px;
    }
    .name{
      font-size: 16px;
    }
    .buttons{
      transform: translateY(0);
      opacity: 1;
    }
}
</style>
