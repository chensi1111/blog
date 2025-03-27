<template>
    <div class="headerContainer" :class="{close:!isNavOpen}">
        <div class="navs">
            <a class="nav"  :class="{active:currentNav=='index'}" @click="scrollToElement('index')">{{t('header.index')}}<el-icon><HomeFilled /></el-icon></a>
            <a class="nav"  :class="{active:currentNav=='about'}" @click="scrollToElement('about')">{{t('header.about')}}<el-icon><UserFilled /></el-icon></a>
            <a class="nav"  :class="{active:currentNav=='experience'}" @click="scrollToElement('experience')">{{t('header.experience')}}<el-icon><GoodsFilled /></el-icon></a>
            <a class="nav"  :class="{active:currentNav=='skill'}" @click="scrollToElement('skill')">{{t('header.skills')}}<el-icon><StarFilled /></el-icon></a>
            <a class="nav"  :class="{active:currentNav=='project'}" @click="scrollToElement('project')">{{t('header.projects')}}<el-icon><Briefcase /></el-icon></a>
            <div class="close" @click="closeNav"><el-icon><CaretTop /></el-icon></div>
        </div>
    </div>
    <div class="open" v-show="isOpenVisible" @click="openNav"><el-icon><CaretBottom /></el-icon></div>
</template>
<script setup lang="ts">
import { CaretTop,CaretBottom,HomeFilled,UserFilled,Briefcase,StarFilled,GoodsFilled} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const currentNav = ref('index')
const isNavOpen=ref(true)
const isOpenVisible = ref(false)
function scrollToElement(target:string){
    const element = document.getElementById(target);
    if (element) {
      const rect = element.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
    currentNav.value = target
}
function closeNav(){
    isNavOpen.value=false
    setTimeout(() => {
        isOpenVisible.value = true
    }, 500)
}
function openNav(){
    isNavOpen.value=true
    isOpenVisible.value = false
}
const sections = ['index', 'about', 'experience', 'skill', 'project'];
function observerNav(){
    sections.forEach((section) => {
        const element = document.getElementById(section);
        if (!element) return;
        const offset = element?.getBoundingClientRect().top;
        if (offset <=101){
            currentNav.value = section;
        }
    });
}
onMounted(() => {
    observerNav()
    window.addEventListener('scroll', () => {
        observerNav()
    });
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', () => {
        observerNav()
    });
});
</script>
<style scoped>
/* *{
    border: 1px solid red;
} */
 a{
    text-decoration: none;
 }
.headerContainer{
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;
    min-width: 450px;
    box-sizing: border-box;
    position: fixed;
    padding: 10px 25px;
    border-radius: 10px;
    background: linear-gradient(to bottom, rgb(50,50,50), rgb(30,30,30),rgb(50,50,50));
    z-index: 100;
    border: 1px solid rgb(170, 170, 170);
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    transition: 0.5s ease-in-out;
}
.close{
    top: -50px;
}
.open{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 30px;
    cursor: pointer;
    z-index: 100;
}
.navs{
    display: flex;
}
.nav{
    margin-right: 15px;
    font-size: 18px;
    font-weight: bolder;
    color: rgb(170, 170, 170);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
}
.nav:last-child{
    margin: 0;
}
.nav.active{
    color: white;
}
.nav::before{
    content: '';
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
.nav:hover::before{
    transform: scaleX(1);
}
.nav .el-icon{
 margin-left: 3px
}
.close {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: white;
    cursor: pointer;
}

@media screen and (max-width: 768px){
    .headerContainer{
        min-width: 380px;
        padding: 8px 15px;
    }
    .open,.close{
        font-size: 20px;
    }
    .nav{
        font-size: 14px;
    }
}
@media screen and (max-width: 414px){
    .headerContainer{
        min-width: 280px;
        height: 40px;
        padding: 5px 10px;
    }
    .open,.close{
        font-size: 15px;
    }
    .nav{
        font-size: 12px;
        margin-right: 8px;
    }
    
}
</style>