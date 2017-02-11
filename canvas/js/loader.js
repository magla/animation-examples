var canvas = {
    images: [],

    loadImages: function() {
        var imgQueue = [];
        var myImages;
        var loadItem = null;

        var data = '[{"image":"img/abstract-q-g-640-480-3.jpg","color":"#04ffbc"},{"image":"img/abstract-q-g-640-480-4.jpg","color":"#00BFFF"},{"image":"img/abstract-q-g-640-480-8.jpg","color":"#ffb608"}]';

        canvas.queue = new createjs.LoadQueue(true, null, "Anonymous");
        canvas.queue.setMaxConnections(10);
        canvas.loaded = false;
        canvas.images = [];

        myImages = $.parseJSON(data);

        for (var i = 0; i <= myImages.length - 1; i++) {
            loadItem = new createjs.LoadItem().set({
                id: 'img' + i,
                src: myImages[i].image,
                crossOrigin: "Anonymous"
            });

            imgQueue.push(loadItem);
        };

        canvas.queue.loadManifest(imgQueue);

        function handleComplete() {
            for (var i = 0; i <= myImages.length - 1; i++) {
                canvas.images.push({
                    image: canvas.queue.getResult('img' + i),
                    color: myImages[i].color
                });
            }

            canvas.canvas = new CircleCanvas();
            canvas.canvas.init();
        }

        canvas.queue.on("complete", handleComplete, this);
    }
}