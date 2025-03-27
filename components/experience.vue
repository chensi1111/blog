<template>
  <div class="EXPContainer">
    <div class="title" :class="{ move: titleMove }" ref="titleRef">{{t('experience.title')}}</div>
    <div
      class="EXPlist"
      v-for="(exp, index) in experiences"
      :key="exp.name"
      :class="{ move: exp.move }"
      :ref="el => expRef[index] = el as HTMLDivElement"
      @mouseenter="(exp.color = '#ff67ff'), (exp.width = '2')"
      @mouseleave="(exp.color = '#D5D5D5'), (exp.width = '1')"
    >
      <div class="time">
        <div
          class="decoration"
          v-html="getSvgIcon(exp.number, exp.color, exp.width)"
        ></div>
        {{ exp.date }}
      </div>
      <div class="info">
        <div class="name">{{ exp.name }}</div>
        <div class="introduce" v-html="formatText(exp.introduce)"></div>
        <div class="skills">
          <div v-for="skill in exp.skills">
            <div class="skill">{{ skill }}</div>
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
const expRef = ref<(HTMLDivElement | null)[]>([]);
const titleMove = ref(false);

const experiences = ref([
  {
    name: t('experience.content.0.company'),
    introduce: t('experience.content.0.introduce'),
    date: "Sep 2024 - Present",
    skills: ["WebSocket", "ThreeJs", "Blender", "Jest", "i18n"],
    number: 1,
    move: false,
    color: "#D5D5D5",
    width: "1",
  },
  {
    name: t('experience.content.1.company'),
    introduce: t('experience.content.1.introduce'),
    date: "Dec 2023 - Sep 2024",
    skills: [
      "TypeScript",
      "Vue2",
      "Vue3",
      "Nuxt3",
      "Sass",
      "Tailwind CSS",
      "Element Plus",
      "Firebase",
      "Git",
      "NodeJs",
    ],
    number: 1,
    move: false,
    color: "#D5D5D5",
    width: "1",
  },
  {
    name: t('experience.content.2.company'),
    introduce: t('experience.content.2.introduce'),
    date: "Nov 2023 - Dec 2023",
    skills: ["HTML", "CSS", "JavaScript", "JQuery", "Bootstrap"],
    number: 2,
    move: false,
    color: "#D5D5D5",
    width: "1",
  },
]);

const getSvgIcon = (number: any, color: string, width: string) => {
  switch (number) {
    case 1:
      return `<svg width="24" height="197" viewBox="0 0 24 197" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="5.65686" width="8" height="8" transform="rotate(-45 7 5.65686)" fill="${color}" stroke='none'/>
          <line x1="23.3747" y1="8.33102" x2="13.3747" y2="19.6515" stroke="#D5D5D5" stroke-width="${width}"/>
          <line y1="-0.5" x2="15.1048" y2="-0.5" transform="matrix(-0.662043 -0.749466 -0.749466 0.662043 23 196.321)" stroke="#D5D5D5" stroke-width="${width}"/>
          <line y1="-0.5" x2="50" y2="-0.5" transform="matrix(0 1 1 0 14 134.651)" stroke="#D5D5D5" stroke-width="${width}"/>
          <line x1="13.5" y1="19" x2="13.5" y2="69" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M1 113L13.5 134.651" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M13.5 69L1 90.6506" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M9 90L14 80V126.5L9 116.5V103.5V90Z" fill="${color}" stroke='none'/>
        </svg>`;
    case 2:
      return `<svg width="24" height="208" viewBox="0 0 24 208" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="5.65686" width="8" height="8" transform="rotate(-45 7 5.65686)" fill="${color}" stroke='none'/>
          <line x1="23.3747" y1="8.33102" x2="13.3747" y2="19.6515" stroke="#D5D5D5" stroke-width="${width}"/>
          <line y1="-0.5" x2="15.1048" y2="-0.5" transform="matrix(-0.662043 -0.749466 -0.749466 0.662043 23 196.321)" stroke="#D5D5D5" stroke-width="${width}"/>
          <line y1="-0.5" x2="50" y2="-0.5" transform="matrix(0 1 1 0 14 134.651)" stroke="#D5D5D5" stroke-width="${width}"/>
          <line x1="13.5" y1="19" x2="13.5" y2="69" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M1 113L13.5 134.651" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M13.5 69L1 90.6506" stroke="#D5D5D5" stroke-width="${width}"/>
          <path d="M9 90L14 80V126.5L9 116.5V103.5V90Z" fill="${color}" stroke='none'/>
          <rect x="7" y="201.657" width="8" height="8" transform="rotate(-45 7 201.657)" fill="${color}" stroke='none'/>
        </svg>`;
  }
};

function handleIntersect(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    const isVisible = entry.isIntersecting;
    if (entry.target === titleRef.value) {
      titleMove.value = isVisible;
    }
    expRef.value.forEach((expElement, index) => {
      if (expElement === entry.target) {
        experiences.value[index].move = isVisible;
      }
    });
  });
}

function formatText(text: string) {
  // 先處理換行符，將 `\n` 替換為 `<br>`
  text = text.replace(/\n/g, '<br>');

  // 再處理加粗文字，將 `**` 包裹的文字轉換為 `<strong>` 標籤
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return text;
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

  expRef.value.forEach((expElement) => {
    if (expElement) {
      observer.observe(expElement);
    }
  });
});
</script>
<style scoped>
/* *{
    border: 1px solid red;
} */
.EXPContainer {
  color: white;
  padding: 20px 0;
  width: 60%;
  margin: 0 auto;
  position: relative;
}
.title {
  letter-spacing: 8px;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 25px;
}
.EXPlist {
  display: flex;
  align-items: center;
  min-height: 150px;
  margin-bottom: 20px;
}

.EXPlist:hover .time,.EXPlist:hover .introduce {
  color: white;
}

.time {
  width: 30%;
  margin-left: 25px;
  padding-top: 5px;
  color: rgb(170, 170, 170);
  display: flex;
  align-items: center;
}
.decoration {
  stroke: white;
  width: 20px;
  margin-right: 15px;
}

.info {
  width: 70%;
}
.name {
  font-weight: bold;
  font-size: 20px;
  width: fit-content;
  position: relative;
}
.name::before {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgb(0, 216, 198);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s;
}
.EXPlist:hover .name::before {
  transform: scaleX(1);
}
.introduce {
  color: rgb(170, 170, 170);
  margin-top: 15px;
}

.title,
.EXPlist {
  transform: translateX(30%);
  opacity: 0;
  transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}
.move {
  transform: translateX(0);
  opacity: 1;
}
.skills {
  display: flex;
  flex-wrap: wrap;
}
.skill {
  font-size: 14px;
  border: 1px solid rgb(255, 102, 255);
  background: linear-gradient(
    to bottom,
    rgb(75, 0, 75),
    rgb(120, 0, 120),
    rgb(75, 0, 75)
  );
  border-radius: 5px;
  padding: 4px 8px;
  margin-top: 15px;
  margin-right: 10px;
}
@media screen and (max-width: 1200px){
    .EXPContainer{
        width: 70%;
    }
    
}
@media screen and (max-width: 1024px){
    .EXPContainer{
        width: 85%;
    }
    .title{
      font-size: 30px;
    }
    .time{
      margin-left: 15px;
      font-size: 14px;
    }
  
}
@media screen and (max-width: 768px){
  .EXPContainer{
        width: 90%;
    }
    .title{
      font-size: 25px;
      margin-bottom: 15px;
    }
    .EXPlist{
      flex-direction: column;
    }
    .decoration{
      display: none;
    }
    .info{
      width: 100%;
    }
    .time{
      width: 100%;
      margin-left: 0;
      margin-bottom: 5px;
      
    }
    .introduce{
      font-size: 14px;
    }
    .skill{
      font-size: 12px;
      margin-top: 10px;
    }
}
</style>
