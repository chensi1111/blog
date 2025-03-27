<template>
    <div class="skillContainer">
        <div class="title" ref="titleRef" :class="{move:titleMove}">{{t('skill.title')}}</div>
        <div class="subTitle first" :class="{move:firstMove}">{{t('skill.subTitle.0.name')}}</div>
        <div class="iconsContainer" ref="firstRef" :class="{move:firstMove}">
            <div class="icons" v-for="skill in skills1" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        <div class="subTitle" :class="{move:secondMove}">{{t('skill.subTitle.1.name')}}</div>
        <div class="iconsContainer" ref="secondRef" :class="{move:secondMove}">
            <div class="icons" v-for="skill in skills2" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        <div class="subTitle" :class="{move:thirdMove}">{{t('skill.subTitle.2.name')}}</div>
        <div class="iconsContainer" ref="thirdRef" :class="{move:thirdMove}">
            <div class="icons" v-for="skill in skills3" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        <div class="subTitle" :class="{move:fourthMove}">{{t('skill.subTitle.3.name')}}</div>
        <div class="iconsContainer" ref="fourthRef" :class="{move:fourthMove}">
            <div class="icons" v-for="skill in skills4" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        <div class="subTitle" :class="{move:fifthMove}">{{t('skill.subTitle.4.name')}}</div>
        <div class="iconsContainer" ref="fifthRef" :class="{move:fifthMove}">
            <div class="icons" v-for="skill in skills5" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        <div class="subTitle" :class="{move:sixthMove}">{{t('skill.subTitle.5.name')}}</div>
        <div class="iconsContainer" ref="sixthRef" :class="{move:sixthMove}">
            <div class="icons" v-for="skill in skills6" :key="skill.name">
                <img :src="`/img/${skill.icon}.png`">
                <div class="name">{{ skill.name }}</div>
            </div>
        </div>
        
    </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const skills1=ref([
    { name:'HTML', icon:'HTML'},
    { name:'CSS', icon:'CSS'},
    { name:'TypeScript', icon:'Typescript'},
    { name:'JavaScript', icon:'Javascript'},
])

const skills2=ref([
    { name:'JQuery', icon:'JQuery'},
    { name:'Vue2', icon:'Vue'},
    { name:'Vue3', icon:'Vue'},
    { name:'Vuex', icon:'Vuex'},
    { name:'Pinia', icon:'Pinia'},
    { name:'Nuxt3', icon:'Nuxt'},
])

const skills3=ref([
    { name:'Bootstrap', icon:'Bootstrap'},
    { name:'Element Plus', icon:'Element Plus'},
])

const skills4=ref([
    { name:'Sass', icon:'Sass'},
    { name:'Tailwind CSS', icon:'Tailwind CSS'},
])

const skills5=ref([
    { name:'Git', icon:'Git'},
    { name:'GitHub', icon:'Github'},
    { name:'Jest', icon:'Jest'},
])

const skills6=ref([
    { name:'Blender', icon:'Blender'},
    { name:'Firebase', icon:'Firebase'},
    { name:'NodeJs', icon:'NodeJs'},
    { name:'ThreeJs', icon:'ThreeJs'},
    { name:'i18n', icon:'i18n'},
])

const titleRef = ref<HTMLDivElement>();
const firstRef = ref<HTMLDivElement>();
const secondRef = ref<HTMLDivElement>();
const thirdRef = ref<HTMLDivElement>();
const fourthRef = ref<HTMLDivElement>();
const fifthRef = ref<HTMLDivElement>();
const sixthRef = ref<HTMLDivElement>();

const titleMove=ref(false)
const firstMove=ref(false)
const secondMove=ref(false)
const thirdMove=ref(false)
const fourthMove=ref(false)
const fifthMove=ref(false)
const sixthMove=ref(false)


function handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
        const isVisible = entry.isIntersecting;
        if (entry.target === titleRef.value) {
            titleMove.value = isVisible;
        } else if (entry.target === firstRef.value) {
            firstMove.value = isVisible;
        } else if (entry.target === secondRef.value) {
            secondMove.value = isVisible;
        } else if (entry.target === thirdRef.value) {
            thirdMove.value = isVisible;
        } else if (entry.target === fourthRef.value) {
            fourthMove.value = isVisible;
        } else if (entry.target === fifthRef.value) {
            fifthMove.value = isVisible;
        } else if (entry.target === sixthRef.value) {
            sixthMove.value = isVisible;
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
  if (firstRef.value) {
    observer.observe(firstRef.value);
  }
  if (secondRef.value) {
    observer.observe(secondRef.value);
  }
  if (thirdRef.value) {
    observer.observe(thirdRef.value);
  }
  if (fourthRef.value) {
    observer.observe(fourthRef.value);
  }
  if (fifthRef.value) {
    observer.observe(fifthRef.value);
  }
  if (sixthRef.value) {
    observer.observe(sixthRef.value);
  }

});
</script>
<style scoped>
.skillContainer{
    color: white;
    padding: 20px 0;
    width: 60%;
    margin: 0 auto;
}
.title{
    letter-spacing: 8px;
    font-size: 35px;
    font-weight: bold;
}
.iconsContainer{
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
}
.icons{
    min-width: 75px;
    height: 90px;
    border: 1px solid gray;
    margin: 0 10px 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, rgb(50,50,50), rgb(30,30,30),rgb(50,50,50));
    border-radius: 10px;

}
.icons:hover{
    background: linear-gradient(to bottom, rgb(75,0,75), rgb(120, 0, 120),rgb(75,0,75));
    cursor: pointer;
    border: 1px solid rgb(255, 102, 255);
}
.icons .name{
    font-size: 12px;
    margin: 8px 10px 0;
}
.icons img{
    width: 40px;
    height: 40px;
}
.subTitle.first{
    margin-top: 25px;
}
.title,.subTitle,.iconsContainer{
    transform: translateX(30%);
    opacity: 0;
    transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}
.move{
    transform: translateX(0);
    opacity: 1;
}
@media screen and (max-width: 1200px){
    .skillContainer{
        width: 70%;
    }
    
}
@media screen and (max-width: 1024px){
    .skillContainer{
        width: 85%;
    }
    .title{
      font-size: 30px;
    }
  
}
@media screen and (max-width: 768px){
    .skillContainer{
        width: 90%;
    }
    .title{
      font-size: 25px;
    }
    .subTitle.first{
        margin-top: 15px;
    }
    .subTitle{
        font-size: 14px;
    }
    .icons{
        min-width: 60px;
        height: 70px;
    }
    .icons img{
        width: 30px;
        height: 30px;
    }
    .icons .name{
        font-size: 10px;
    }
  
}
</style>