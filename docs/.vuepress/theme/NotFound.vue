<template>
    <div>
        <h1>404</h1>
        <blockquote>{{ getMsg() }}</blockquote>
        <router-link to="/">Take me home.</router-link>
    </div>
</template>

<script>
  const msgs = [
    `M78 නිහාරිකාව වෙත සාදරයෙන් පිළිගනිමු`,
    `Welcome to the M78 Nebula!`,
    `M78星雲へようこそ`,
    `Bienvenue dans la nébuleuse M78`,
    `歡迎來到M78星雲`,
    `M78 성운에 오신 것을 환영합니다.`,
    `Willkommen im M78-Nebel`,
    `Բարի գալուստ M78 Nebula`
  ]

  export default {
    methods: {
      getMsg() {
        return msgs[Math.floor(Math.random() * msgs.length)]
      }
    }
  }
</script>


