<template>
    <div class="menu" @click="openMenu">
        <el-icon v-show="!menuOpen"><Fold /></el-icon>
        <el-icon v-show="menuOpen"><Expand /></el-icon>
    </div>
    <a class="button" :class="{open:menuOpen}" href="#index" v-show="menuOpen"><el-icon><CaretTop /></el-icon></a>
    <div class="button lan" @click="changeLocale('ZH')" :class="{open:menuOpen}" v-show="locale=='EN'&&menuOpen">ZH</div>
    <div class="button lan" @click="changeLocale('EN')" :class="{open:menuOpen}" v-show="locale=='ZH'&&menuOpen">EN</div>
</template>
<script setup lang="ts">
import { CaretTop,Expand,Fold} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
const { setLocale,locale } = useI18n()

const menuOpen = ref(false)
function openMenu(){
    menuOpen.value = !menuOpen.value
}
function changeLocale(language:any){
    setLocale(language)
}
</script>
<style scoped>
.menu,.button{
    position: fixed;
    color: black;
    font-size: 30px;
    width: 45px;
    height: 45px;
    border-radius: 25px;
    background: linear-gradient(to bottom, rgb(200, 200, 200), rgb(150,150,150),rgb(200,200,200));
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.menu{
    bottom: 50px;
    right: 50px;
}
.button{
    bottom: 80px;
    right: 50px;
    opacity: 0;
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}
.button.lan{
    bottom: 140px;
    right: 50px;
    font-size: 18px;
    font-weight: bold;
}
.button.open {
    transform: translateY(-30px);
    opacity: 1;
}
@media screen and (max-width: 768px){
    .menu,.button{
        width: 35px;
        height: 35px;
        font-size: 25px;
    }
    .menu{
        bottom: 20px;
        right: 20px;
    }
    .button{
        bottom: 40px;
        right: 20px;
    }
    .button.lan{
        bottom: 90px;
        right: 20px;
    }
    
}
</style>