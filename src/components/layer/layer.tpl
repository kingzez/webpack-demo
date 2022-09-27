<div class="layer">
    <!-- 模板中引入相对路径的图片需要使用require实现 -->
    <img src="${ require('../../assets/avator.png') }" />
    <div> this is a <%= name %> layer</div>
    <% for (var i = 0; i < arr.length; i++ ) { %>
        <%= arr[i] %>
    <% } %>
</div>