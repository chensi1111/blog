<template>
  <div class="projectContainer">
    <div class="title" ref="titleRef" :class="{ move: titleMove }">專案</div>
    <div class="projects">
      <div
        class="project"
        v-for="project in projects"
        :key="project.name"
        @click="showProjectInfo(project)"
      >
        <div class="pic">
          <div class="pin" v-if="project.pin"><img src="/img/pin.png" /></div>
          <div
            class="web"
            :style="{ backgroundImage: `url(${project.web})` }"
          ></div>
          <div
            class="phone"
            :style="{ backgroundImage: `url(${project.phone})` }"
          ></div>
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
              <a class="button" :href="project.github" target="_blank"
                ><img src="/img/githubLogo.png"
              /></a>
              <a class="button" :href="project.link" target="_blank"
                ><img src="/img/link.png"
              /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="projectInfo" v-show="isShowProjectInfo">
      <div class="cancel" @click="isShowProjectInfo = false">X</div>
      <div class="projectInfos">
        <div class="projectPic">
          <div class="projectWeb"><img :src="projectInfo.web" /></div>
          <div class="projectPhone"><img :src="projectInfo.phone" /></div>
        </div>
        <div class="projectIntroduce">
          <div class="projectDate">
            <div class="projectTitle">專案日期 : </div>
            <span>{{ projectInfo.time }}</span>
          </div>
          <div class="projectName">
            <div class="projectTitle">專案名稱 : </div>
            <span>{{ projectInfo.name }}</span>
          </div>
          <div class="projectLinks">
            <div class="projectTitle">專案連結 : </div>
            <a :href="projectInfo.link" target="_blank">Demo</a><a :href="projectInfo.github" target="_blank">Github</a>
          </div>
          <div class="projectSkills">
            <div class="projectTitle">專案技能 : </div>
            <span v-for="skill in projectInfo.skill">
              <div>{{ skill }}</div>
            </span>
          </div>
          <div class="projectDescribe">
            <div class="projectTitle">專案簡介 : </div>
            <span>{{ projectInfo.introduce }}</span>
          </div>
          <div class="projectExplain">
            <div class="projectTitle">專案說明 : </div>
            <span>{{ projectInfo.explain }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
let observer: IntersectionObserver;
const titleRef = ref<HTMLDivElement>();
const titleMove = ref(false);

const projects = ref([
  {
    name: t("project.content.0.name"),
    time: "Apr 2025",
    skill: ["Nuxt3", "TypeScript", "ThreeJs"],
    introduce: t("project.content.0.introduce"),
    pin: true,
    web: "/blog/img/blogWeb.png",
    phone: "/blog/img/blogPhone.jpg",
    explain: t("project.content.0.explain"),
  },
  {
    name: t("project.content.1.name"),
    time: "Mon 2025",
    skill: ["Vue3", "TypeScript", "Three.js"],
    introduce: t("project.content.1.introduce"),
    web: "/blog/img/birthdayWeb.png",
    phone: "/blog/img/birthdayPhone.jpg",
    link: "https://chensi1111.github.io/birthday/#/範例/範例禮物",
    github: "https://github.com/chensi1111/birthday",
    explain: t("project.content.1.explain"),
  },
  {
    name: t("project.content.2.name"),
    time: "Aug 2024",
    skill: ["Nuxt3", "TypeScript", "Tailwind CSS"],
    introduce: t("project.content.2.introduce"),
    web: "/blog/img/weatherWeb.png",
    phone: "/blog/img/weatherPhone.jpg",
    link: "https://chensi1111.github.io/MyWeather/",
    github: "https://github.com/chensi1111/MyWeather",
    explain: t("project.content.2.explain"),
  },
  {
    name: t("project.content.3.name"),
    time: "Jul 2024",
    skill: ["Vue3", "TypeScript", "Firebase"],
    introduce: t("project.content.3.introduce"),
    web: "/blog/img/shoppingWeb.png",
    phone: "/blog/img/shoppingPhone.jpg",
    link: "https://chensi1111.github.io/Elysian-MiragO/",
    github: "https://github.com/chensi1111/Elysian-MiragO",
    explain: t("project.content.3.explain"),
  },
  {
    name: t("project.content.4.name"),
    time: "May 2024",
    skill: ["Vue3", "JavaScript", "Firebase"],
    introduce: t("project.content.4.introduce"),
    web: "/blog/img/hotelWeb.png",
    phone: "/blog/img/hotelPhone.jpg",
    link: "https://github.com/chensi1111/DawnHotel",
    github: "https://chensi1111.github.io/DawnHotel/",
    explain: t("project.content.4.explain"),
  },
]);
const isShowProjectInfo = ref(false);
const projectInfo = ref({
  name: "",
  time: "",
  skill: [],
  introduce: "",
  web: "",
  phone: "",
  link: "",
  github: "",
  explain: "",
});
function showProjectInfo(project: any) {
  isShowProjectInfo.value = true;
  projectInfo.value = project;
}

function handleIntersect(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    const isVisible = entry.isIntersecting;
    if (entry.target === titleRef.value) {
      titleMove.value = isVisible;
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
  }
}
onMounted(() => {
  handleResizeIntersectionObserver();
  window.addEventListener("resize", () => {
    handleResizeIntersectionObserver();
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    handleResizeIntersectionObserver();
  });
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
  background: linear-gradient(
    to bottom,
    rgb(50, 50, 50),
    rgb(30, 30, 30),
    rgb(50, 50, 50)
  );
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
.pic {
  border: 1px solid black;
  height: 150px;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  position: relative;
}
.pin {
  position: absolute;
  top: 5px;
  right: 5px;
}
.web {
  width: 75%;
  height: 100%;
  background-size: cover;
  background-position: left;
  border-right: 3px solid black;
}
.phone {
  width: 25%;
  height: 100%;
  background-size: cover;
  background-position: left;
}
.infos {
  display: flex;
  padding: 0 20px;
}
.info {
  width: 100%;
  margin-top: 20px;
  position: relative;
}
.name {
  font-size: 18px;
  font-weight: bold;
  display: flex;
}
.name span {
  margin-right: 10px;
}
.time {
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(170, 170, 170);
}
.skills {
  font-size: 14px;
  color: rgb(170, 170, 170);
  margin-top: 10px;
  display: flex;
}
.skill {
  margin-right: 10px;
}
.introduce {
  font-size: 14px;
  color: white;
  margin-top: 10px;
}
.buttons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  transform: translateY(25px);
  opacity: 0;
  transition: 0.5s ease-in-out;
}
.button {
  background-color: gray;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}
.button:hover {
  background-color: white;
}
img {
  width: 20px;
  height: 20px;
}
.projectInfo {
  max-height: 600px;
  width: 60%;
  position: fixed;
  padding: 20px;
  border-radius: 20px;
  overflow: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    to bottom,
    rgb(30, 30, 30),
    rgb(50, 50, 50),
    rgb(30, 30, 30)
  );
  z-index: 200;
}
.cancel {
  cursor: pointer;
  margin-bottom: 10px;
  width: fit-content;
}
.projectInfos {
  display: flex;
  height: 100%;
}
.projectPic {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.projectWeb,
.projectPhone {
  width: 100%;
  display: flex;
  justify-content: center;
}
.projectWeb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.projectPhone img {
  width: 50%;
  height: 100%;
  object-fit: cover;
}
.projectIntroduce {
  width: 50%;
  padding: 15px 20px;
  margin-left: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-left: 2px solid rgb(150, 150, 150);
}
.projectTitle{
  font-weight: bold;
  white-space: nowrap;
}
.projectName,.projectDate,.projectLinks,.projectSkills,.projectDescribe,.projectExplain{
  display: flex;
  align-items: start;
  gap: 5px;
}
.projectLinks a {
  cursor: pointer;
  color: rgb(150, 150, 255);
  text-decoration: none;
}
.projectSkills {
  flex-wrap: wrap;
}
.projectSkills span {
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
  width: fit-content;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 1px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
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
@media screen and (max-width: 1200px) {
  .projectContainer {
    width: 70%;
  }
}
@media screen and (max-width: 1024px) {
  .projectContainer {
    width: 85%;
  }
  .title {
    font-size: 30px;
  }
  .button {
    width: 25px;
    height: 25px;
  }
}
@media screen and (max-width: 768px) {
  .projectContainer {
    width: 90%;
  }
  .title {
    font-size: 25px;
    margin-bottom: 15px;
  }
  .projects {
    gap: 0;
  }
  .project {
    width: 100%;
    margin-bottom: 20px;
  }
  .infos {
    padding: 0 10px;
  }
  .name {
    font-size: 16px;
  }
  .buttons {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
