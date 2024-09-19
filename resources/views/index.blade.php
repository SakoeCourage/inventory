<!DOCTYPE html>
<html lang="en">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    <title>Inventory Lite</title>
    @vite('resources/js/index.scss')
</head>

<body>
    <div id="root">
    </div>
    <div class="pagepreloader">
        <div class="loadingwheel ">
            <div class="loadingBar"></div>
        </div>
    </div>
    @vite('resources/js/main.jsx')
</body>
<style>
    div.pagepreloader {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: flex-start;
        background-color: rgb(243 244 246 / 0.1);
        isolation: isolate;
        z-index: 90;
    }

    .loadingwheel {
        width: 100%;
        margin: 0 auto;
        border-radius: 10px;
        position: relative;
        padding: 1.5px;
        background-color: #e4e4e7;
        animation: loadingwheel 5s linear infinite;
    }

    .loadingwheel:before {
        content: '';
        border-radius: 10px;
        position: absolute;
        top: -4px;
        right: -4px;
        bottom: -4px;
        left: -4px;
    }

    .loadingwheel .loadingBar {
        position: absolute;
        border-radius: 10px;
        top: 0;
        right: 100%;
        bottom: 0;
        left: 0;
        width: 0;
        border-radius: 1rem;
        animation: wheelbar 2s linear infinite;
    }

    @keyframes wheelbar {
        0% {
            left: 0%;
            right: 100%;
            width: 0%;
            background: #881337;
        }

        10% {
            left: 0%;
            right: 75%;
            width: 15%;
            background: #450a0a;
        }
        30% {
            left: 0%;
            right: 75%;
            width: 25%;
            background: #881337;
        }
        50% {
            left: 0%;
            right: 75%;
            width: 35%;
            background: #881337;
        }

        90% {
            right: 0%;
            left: 75%;
            width: 40%;
            background: #c2410c;
        }

        100% {
            left: 100%;
            right: 0%;
            width: 40%;
            background: #450a0a;
        }
    }

    @keyframes loadingwheel {
        0% {
            background: #fb923c;
        }

        10% {
            background: #fb923c;

        }

        90% {
            background: #fb923c;

        }

        100% {
            background: #fb923c;

        }
    }
</style>

</html>
