<script>
    // Array that contains the data of each team member
    let teamMembers = [
        { name: 'Francis', role: 'Project Manager', image: './src/lib/images/1-francis.png' },
        { name: 'Mary', role: 'Technical Designer', image: './src/lib/images/2-mary.png' },
        { name: 'Luisa', role: 'Lead Developer', image: './src/lib/images/3-luisa.png' },
        { name: 'Irah', role: 'Developer', image: './src/lib/images/4-irah.png' },
        { name: 'Angela', role: 'System Analyst', image: './src/lib/images/5-angela.png' },
        { name: 'Aaron', role: 'Business Analyst', image: './src/lib/images/6-aaron.png' },
        { name: 'Alessa', role: 'Business Analyst', image: './src/lib/images/7-alessa.png' },
        { name: 'Joaquin', role: 'Technical Writer', image: './src/lib/images/8-eduardo.png' },
        { name: 'Alwyn', role: 'Technical Writer', image: './src/lib/images/9-alwyn.png' }
    ];
</script>

<main class="flex-center-row">
    <div class="main-container">
        <div class="title">
            Meet our squad of <span>creators, designers, </span> and <span>problem-solving enthusiasts</span>.
        </div>
        <div class="description">
            To build a platform for the community, it takes a dynamic group of passionate collaborators. Get to know the faces behind the scenes at PUP MunchHub, leading the way in our munchful journey!
        </div>
        <div class="team">
            {#each teamMembers as member}
                <div class="flex-center-col">
                    <img src={member.image} alt={member.name} />
                    <span class="name">{member.name}</span>
                    <span class="role">{member.role}</span>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        width: 100%;
    }

    div.main-container {
        width: 75%;
        height: 100%;
        margin: 10svh 0;
    }

    div.description {
        width: 80%;
        text-align: justify;
    }

    div.title {
        color: #272727;
        font-stretch: expanded;
        padding: 50px 0 30px 0;
        font-weight: 600;
        font-size:calc(22px + 2vw);
    }

    div.title span {
        color: #630A10;
    }

    div.description {
        color: #272727;
        font-size: 21px;
        font-weight: 500;
    }

    div.team {
        margin: 50px 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
        gap: 40px;
        justify-content: center;
    }

    .team:nth-child(n+6) {
        grid-column-end: span 1;
    }

    div.team img {
        width:100%;
        height: auto;
        border-radius: 50%;
    }

    div.team .name {
        font-weight: 600;
        font-size: 23px;
    }

    div.team .role {
        font-size: 18px; 
        font-family: 'Mona Sans-I', system-ui, Avenir, Helvetica, Arial, sans-serif;
    }

    /* responsive */

    @media (max-width: 500px) {
        div.description {
            width: 100%;
        }
    }


</style>