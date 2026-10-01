export const downloadCSV = (data, filename) => {

    if (!data.length) return;

    const headers = Object.keys(data[0]);

    const csvRows = [

        headers.join(","),

        ...data.map((row) =>
            headers.map((field) => row[field]).join(",")
        ),

    ];

    const blob = new Blob(

        [csvRows.join("\n")],

        { type: "text/csv" }

    );

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    window.URL.revokeObjectURL(url);

};