const mentionsStyle = {
    control: {
        backgroundColor: "#fff",
        fontSize: 14,
        lineHeight: 1.5,
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "4px",
    },
    "&multiLine": {
        control: {
            minHeight: 50,
        },
    },
    highlighter: {
        overflow: "hidden",
    },
    input: {
        margin: 0,
    },
    suggestions: {
        list: {
            backgroundColor: "#fff",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: "4px",
            zIndex: 1000,
        },
        item: {
            padding: "5px 10px",
            borderBottom: "1px solid #ddd",
            "&focused": {
                backgroundColor: "#007bff",
                color: "#fff",
            },
        },
    },
};

export default mentionsStyle;
