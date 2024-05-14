import { defineStore } from "pinia";

type NavType = {
  title?: string;
  date?: string;
}

const useNavStore = defineStore('nav', {
  state: () => ({
    pre: {
      title: undefined,
      date: undefined
    },
    next: {
      title: undefined,
      date: undefined
    },
    nav: []
  } as { pre: NavType, next: NavType, nav: NavType[] }),
  actions: {
    setPreNext(pre: NavType, next: NavType) {
      this.pre = pre
      this.next = next
    },
    setNav(nav: NavType[]) {
      this.nav = nav
    }
  }
})

export default useNavStore