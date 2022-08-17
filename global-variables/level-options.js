// level information
const level_options = {
    easy: {
        row: 9,
        col: 9,
        mine: 10,
        container: {
            cWidth: "304px",
            cHeight: "374px"
        },
        menu: {
            mWidth: "300px",
            mHeight: "70px",
        },
        table: {
            tWidth: "300px",
            tHeight: "300px",
        }
    },

    intermediate: {
        row: 16,
        col: 16,
        mine: 40,
        container: {
            cWidth: "504px",
            cHeight: "574px"
        },
        menu: {
            mWidth: "500px",
            mHeight: "70px",
        },
        table: {
            tWidth: "500px",
            tHeight: "500px",
        }
    },

    hard: {
        row: 16,
        col: 30,
        mine: 99,
        container: {
            cWidth: "854px",
            cHeight: "574px"
        },
        menu: {
            mWidth: "850px",
            mHeight: "70px",
        },
        table: {
            tWidth: "850px",
            tHeight: "500px",
        }
    },
}

export default level_options;