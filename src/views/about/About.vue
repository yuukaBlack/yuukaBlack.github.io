<template>
  <div class="main">
    <div class="about">
      <h1>关于我</h1>
      <div>
        工作：前端开发<br />
        技能：vue和react都会写，vue3正在学。。。<br />
        城市：北漂中<br />
        爱好：旅行、美食、猫猫！！<br />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  width: 55vw;
  margin: 0 auto;
  padding-top: 100px;
  h1 {
    margin-bottom: 20px;
  }
  div {
    line-height: 40px;
  }
}
@media (max-width: 768px) {
  .about {
    width: 90vw;
  }
}
</style>
