document.getElementById('screenshotButton').addEventListener('click', () => {
    const visualizationContainer = document.getElementById('visualization');
    const originalHeight = visualizationContainer.style.height; // Save the original height
    const originalWidth = visualizationContainer.style.width;   // Save the original width

    // Temporarily set the height and width to the full scroll dimensions
    visualizationContainer.style.height = `${visualizationContainer.scrollHeight}px`;
    visualizationContainer.style.width = `${visualizationContainer.scrollWidth}px`;

    // Capture the screenshot with html2canvas
    html2canvas(visualizationContainer, {
        useCORS: true // Handles cross-origin images if any
    }).then(canvas => {
        var imgData1 = [canvas,canvas.toDataURL("image/png")];

        const visualizationContainer1 = document.getElementById('memoryVisualization');
        const originalHeight1 = visualizationContainer1.style.height; // Save the original height
        const originalWidth1 = visualizationContainer1.style.width;   // Save the original width
    
        // Temporarily set the height and width to the full scroll dimensions
        visualizationContainer1.style.height = `${visualizationContainer1.scrollHeight}px`;
        visualizationContainer1.style.width = `${visualizationContainer1.scrollWidth}px`;
    
        // Capture the screenshot with html2canvas
        html2canvas(visualizationContainer1, {
            useCORS: true // Handles cross-origin images if any
        }).then(canvas1 => {
            // const imgData2 = canvas1.toDataURL("image/png");
            
            const cnv=document.createElement("canvas");
            const ctx=cnv.getContext('2d');
            cnv.width=canvas1.width+imgData1[0].width
            cnv.height=Math.max(canvas1.height,imgData1[0].height)
            ctx.drawImage(imgData1[0],0,0)
            ctx.drawImage(canvas1,imgData1[0].width,0);

            const imgData3=cnv.toDataURL("image/png");
            
            // Create an image download link
            const downloadLink = document.createElement("a");
            downloadLink.href = imgData3;
            downloadLink.download = "visualization-full-resolution.png";
            downloadLink.click();
    
            // Reset the container height and width to their original states
            visualizationContainer1.style.height = originalHeight1;
            visualizationContainer1.style.width = originalWidth1;
        }).catch(err => {
            console.error("Error capturing screenshot:", err);
        });

        // Reset the container height and width to their original states
        visualizationContainer.style.height = originalHeight;
        visualizationContainer.style.width = originalWidth;
    }).catch(err => {
        console.error("Error capturing screenshot:", err);
    });
});