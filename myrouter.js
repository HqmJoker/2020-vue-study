import Home from "./views/Home";
import About from "./views/About";
import Vue from 'vue';
class VueRouter {
    constructor(options) {
        this.$options = options;
        this.routesMap = {}
        this.app = new Vue({
            data: {
                current: '/'
            }
        });
    }

    init(){
        this.bindEvents();  // 监听url变化
        this.createRoutesMap(this.$options);  // 解析路由配置
        this.initComponents();  // 实现组件
    }
    bindEvents() {
        window.addEventListener("load", this.onHashChange.bind(this))
        window.addEventListener("hashchange", this.onHashChange.bind(this))
    }
    createRoutesMap(options) {
        options.routes.forEach((item)=>{
            this.routesMap[item.path] = item.component;
        })
    }
    initComponents() {
        Vue.component("router-link", {
            props: { to : String },
            render(h) {
                return h("a", { attrs: { href: "#" + this.to } }, [
                    this.$slots.default
                ]);
            }
        });

        Vue.component("router-view", {
            render: h => {
                const comp = this.routesMap[this.app.current]
                return h(comp);
            }
        })
    }
    onHashChange() {
        this.app.current = window.location.hash.slice(1) || "/";
    }
}

VueRouter.install = function(){
    // 混入
    Vue.mixin({
        beforeCreate() {
            // 初始化路由配置信息
            if (this.$options.router) {  // 组件是否存在$options.router，该对象只在根组件上有
                Vue.prototype.$options = this.$options.router;
                this.$options.router.init();
            }
        }
    });
}

Vue.use(VueRouter); 

export default new VueRouter({
    routes: [{ path: "/", component: Home }, { path: "/about", component: About }]
});
