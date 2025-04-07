<template>
    <div class="aboutContainer">
        <div class="title" :class="{move:titleMove}" ref="titleRef">{{t('about.title')}}</div>
        <div class="introduce" :class="{move:introduceMove}" ref="introduceRef">{{t('about.introduce')}}</div>
    </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const titleRef = ref<HTMLDivElement>();
const introduceRef = ref<HTMLDivElement>();
const titleMove=ref(false)
const introduceMove=ref(false)
let observer: IntersectionObserver;

function handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
        const isVisible = entry.isIntersecting;
        if (entry.target === titleRef.value) {
            titleMove.value = isVisible;
        } else if (entry.target === introduceRef.value) {
            introduceMove.value = isVisible;
        }
    });
}

function handleResizeIntersectionObserver() {
  if (window.innerWidth <= 768) {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -100px 0px", 
      threshold: 0,
    });

    if (titleRef.value) {
      observer.observe(titleRef.value);
    }
    if (introduceRef.value) {
      observer.observe(introduceRef.value);
    }
  } else {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -200px 0px", 
      threshold: 0,
    });

    if (titleRef.value) {
      observer.observe(titleRef.value);
    }
    if (introduceRef.value) {
      observer.observe(introduceRef.value);
    }
  }
}
onMounted(() => {
  handleResizeIntersectionObserver()
  window.addEventListener('resize', () => {
    handleResizeIntersectionObserver()
  });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    handleResizeIntersectionObserver()
  });
});
</script>
<style scoped>
.aboutContainer{
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
.introduce{
    font-size: 18px;
    margin-top: 25px;
}
.title,
.introduce {
    transform: translateX(30%);
    opacity: 0;
    transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}
.move{
    transform: translateX(0);
    opacity: 1;
}
@media screen and (max-width: 1200px){
    .aboutContainer{
        width: 70%;
    }
    
}
@media screen and (max-width: 1024px){
    .aboutContainer{
        width: 85%;
    }
    .title{
      font-size: 30px;
    }
  
}
@media screen and (max-width: 768px){
    .aboutContainer{
        width: 90%;
    }
    .title{
      font-size: 25px;
    }
    .introduce{
        font-size: 14px;
        margin-top: 15px;
    }
  
}
</style>