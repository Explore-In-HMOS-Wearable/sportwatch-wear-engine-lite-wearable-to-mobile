import app from '@system.app';
import router from '@system.router';

export default {
    data: {
        title: 'Splash Screen',
    },

    swipe: function (e) {
        if (e.direction === 'right') {
            app.terminate();
        }
    },

    onInit() {
        routeToMain()
    }
}

function routeToMain() {
    setTimeout(function () {
        router.replace({
            uri: 'pages/mainPage/mainPage'
        });
    }, 300);
}
