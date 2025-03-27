<template>
    <div class="footer">
        <div class="name">© 2025 Andy Chen</div>
        <div class="logos"></div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer{
    width: 60%;
    height: 80px;
    padding: 0 10px;
    margin: 15px auto 0;
    border-top: 1px solid rgb(170, 170, 170);
    display: flex;
    font-size:12px;
    color: white;
}
.name{
    margin-top: 10px;
}
@media screen and (max-width: 1200px){
    .footer{
        width: 70%;
    }
}
@media screen and (max-width: 1024px){
    .footer{
        width: 85%;
    }
}
@media screen and (max-width: 768px){
    .footer{
        width: 90%;
    }
}
</style>