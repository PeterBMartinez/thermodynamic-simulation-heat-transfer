import { 
    topLeftCornerPipeSegment,
    topRightCornerPipeSegment,
    bottomLeftCornerPipeSegment,
    bottomRightCornerPipeSegment,
    horizontalPipeSegment,
    emptyPipeSegment,
    storageTank as storageTankArt,
    solarCell,
    sun
} from "../utils/ascii-art";

export default function Chart({solarPanelTemperature = 55, topPipeTemperature = 22, bottomPipeTemperature = 22, storageTankTemperature = 22}) {
    const coolingSystemLength = 20;

    const generateCoolingSystem = (firstPipeSegment: string[], lastPipeSegment: string[]): string[] => {
        let topOfPipeArray = '';
        let middleOfPipeArray = '';
        let bottomOfPipeArray = '';

        for (let i = 0; i <= (coolingSystemLength) / 2; i++) {
            switch(i) {
                case 0:
                    topOfPipeArray += emptyPipeSegment[0]
                    middleOfPipeArray += emptyPipeSegment[1]
                    bottomOfPipeArray += emptyPipeSegment[2]
                    break;
                case (coolingSystemLength / 2):
                    topOfPipeArray += lastPipeSegment[0]
                    middleOfPipeArray += lastPipeSegment[1]
                    bottomOfPipeArray += lastPipeSegment[2]
                    break;
                case 1:
                    topOfPipeArray += firstPipeSegment[0]
                    middleOfPipeArray += firstPipeSegment[1]
                    bottomOfPipeArray += firstPipeSegment[2]
                    break;
                default:
                    topOfPipeArray += horizontalPipeSegment[0]
                    middleOfPipeArray += horizontalPipeSegment[1]
                    bottomOfPipeArray += horizontalPipeSegment[2]
                    break;
            }
        }
        
        let coolingSystem: string[] = [topOfPipeArray, middleOfPipeArray, bottomOfPipeArray];

        return coolingSystem;
    }

    const generateSolarPanel = (height: number, width: number) => {
        let solarPanel = [];
        let top = solarCell[0];
        let middle = solarCell[1];
        let bottom = solarCell[2];
        for (let i = 0; i < height; i++) {
            let topSolarCells = '';
            let middleSolarCells = '';
            let bottomSolarCells = '';

            for (let j = 0; j < width; j++) {
                topSolarCells += top;
                middleSolarCells += middle;
                bottomSolarCells += bottom;
            }
            solarPanel.push(topSolarCells);
            solarPanel.push(middleSolarCells);
            solarPanel.push(bottomSolarCells);
        }
        return solarPanel
    }

    const generateStorageTank = (solarArray: string[], amountOfSpaces: number) => {
        const solarArrayCopy: string[] = [...solarArray];

        const height = solarArrayCopy.length < 13 ? 13 : solarArrayCopy.length; 

        for (let i = 0; i < height; i++) {
            if (storageTankArt[i] && solarArrayCopy[i]) {
                solarArrayCopy[i] = solarArrayCopy[i].padEnd((solarArrayCopy[i].length + amountOfSpaces) - 5, ' ');
                solarArrayCopy[i] = solarArrayCopy[i] + storageTankArt[i];
            } else if (!solarArrayCopy[i]) {
                solarArrayCopy[i] = '';
                solarArrayCopy[i] = solarArrayCopy[i].padEnd((solarArrayCopy[1].length - amountOfSpaces / 2) + 1, ' ')
                solarArrayCopy[i] = solarArrayCopy[i] + storageTankArt[i];
            }
        }
        return solarArrayCopy;
    }

    const convertIntoSingleStringBasedOnChartSize = (chartSize: number, firstString: string, secondString: string) => {
        const remainingSpace = chartSize - firstString.length - secondString.length;
        let newString = '';
        newString += firstString;
        newString = newString.padEnd(newString.length + remainingSpace, ' ');
        newString += secondString;
        return newString;
    }
    
    const generateTopCoolingSystemArray = (): string[] => {
        const topCoolingSystemSegmentLabel = [`Top Cooling System Piping System: ${topPipeTemperature}°C`];
        const topCoolingSystemSegment = generateCoolingSystem(topLeftCornerPipeSegment, topRightCornerPipeSegment);
        topCoolingSystemSegmentLabel[0] = topCoolingSystemSegmentLabel[0].padStart(topCoolingSystemSegment[0].length - 15, ' ');
        return [...topCoolingSystemSegmentLabel, ...topCoolingSystemSegment]
    }

    const generateSolarPanelAndStorageTankWithLabels = (longestStringLength: number) => {
        const solarPanelTemperatureLabel = `Solar Panel Temperature: ${solarPanelTemperature}°C`;
        const storageTankTemperatureLabel = `Storage Tank Temperature: ${storageTankTemperature}°C`;
        const solarPanelAndStorageTankTemperatureLabel = [convertIntoSingleStringBasedOnChartSize(longestStringLength + 10, solarPanelTemperatureLabel, storageTankTemperatureLabel)];
        const solarPanelAndStorageTank = generateStorageTank(generateSolarPanel(4, 5), (longestStringLength - storageTankArt[0].length) - 10)
        return [...solarPanelAndStorageTankTemperatureLabel, ...solarPanelAndStorageTank];
    }

    const generateBottomCoolingSystemArray = (longestStringLength: number): string[] => {
        const bottomCoolingSystemSegment = generateCoolingSystem(bottomLeftCornerPipeSegment, bottomRightCornerPipeSegment);
        const bottomCoolingSystemSegmentLabel = [`Bottom Cooling System Piping System: ${bottomPipeTemperature}°C`];
        bottomCoolingSystemSegmentLabel[0] = bottomCoolingSystemSegmentLabel[0].padStart(longestStringLength - 15, ' ');

        return [...bottomCoolingSystemSegment, ...bottomCoolingSystemSegmentLabel];
    }
    
    const generateChart = () => {

        const topSegmentForChart = generateTopCoolingSystemArray();
        const longestString = topSegmentForChart.reduce((a, b) => a.length > b.length ? a : b).length;
        const solarPanelAndStorageTankChart = generateSolarPanelAndStorageTankWithLabels(longestString);
        const bottomSegmentForChart = generateBottomCoolingSystemArray(longestString);

        return [
            ...sun,
            ...topSegmentForChart,
            ...solarPanelAndStorageTankChart,
            ...bottomSegmentForChart,
        ];
    }

    return (
        <>
            <div className="flex justify-center mb-24">
                    <pre>
                        <code>
                            {generateChart().join('\n')}
                        </code>
                    </pre>
            </div>
        </>
    );
}