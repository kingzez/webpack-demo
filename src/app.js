import './css/common.css';
import Layer from './components/layer/layer.js';

const App = function() {
    var dom = document.querySelector('#app');
    var layer = new Layer();
    
    dom.innerHTML = layer.tpl({
        name: 'kingzez',
        arr: ['apple', 'xiaomi', 'oppo']
    });
}

new App()