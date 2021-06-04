import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
        return{
            api: 'https://vue3-course-api.hexschool.io',
            user: {
                username: '',
                password: '',
            },
            page: '',
        }
    },
    methods: {
        login() {
            const url = `${this.api}/admin/signin`;
            axios.post(url, this.user).then((res) => {
                // console.log(res)
                if(res.data.success) {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken = ${token}; expires = ${new Date(expired)}; path=/`;
                    window.location = `products.html`;
                } else {
                    alert(res.data.message);
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    created() {

    }
}).mount('#app')
