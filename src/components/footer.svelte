<script>
    // No script needed here because this is a static section. ^^
</script>

<main class="flex-center-row">
    <div class="container">
        <img src="./src/assets/images/pupmh-logo.png" alt="logo">
        <div class="content flex-center-col">
            <span>Byte by byte we build this hub, made with love and grades to dub. ❤</span>
            <span>PUP MANILA | BSIT 2-1 A.Y. 2023-2024 | JAVASCRIPT GROUP</span>
            <span>All content presented here is for educational purposes only, protected by fair use copyright.</span>
        </div>
        <img src="./src/assets/images/js2-1-logo.png" alt="logo">
    </div>
</main>

<style>
    main {
        width: 100%;
        background: url('./src/lib/images/background-bw.png') no-repeat center center;
        background-size: cover;
        text-align: center;
    }

    img {
        height: 35%;
        margin: 0px 20px;
    }

    div.container {
        height: 30vh;
        width: 90%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    }

    div.container span:first-child, div.container span:last-child {
        font-weight: 600;
    }

    div.container span {
        color: #141414;
        font-size: 16px;
        margin: 2px 0;
    }

    div.container span:nth-child(2) {
        font-weight: 700;
    }

    div.container span:first-child {
        font-family: 'Mona Sans-SBI', system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    /* responsive */
    
    @media (max-width: 916px) {
        div.container span {
            font-size: 14px;
            margin: 5px 0;
        }
    }

    @media (max-width: 670px) {
        
        div.container {
            flex-direction: column;
            height: auto;
            padding: 50px 0;
        }

        div.container span {
            margin: 10px 0;
        }

        div.container img {
            height: 35px;
            margin: 20px 0;
        }
    }
</style>