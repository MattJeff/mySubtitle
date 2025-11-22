import { SRTParser } from './src/utils/srt-parser';

const mockSRT = `
1
00:00:01,000 --> 00:00:03,000
Hello World

2
00:00:03,500 --> 00:00:05,500
This is a test
`;

const cues = SRTParser.parse(mockSRT);
console.log('Parsed Cues:', JSON.stringify(cues, null, 2));

if (cues.length === 2 && cues[0].text === 'Hello World' && cues[0].startTime === 1000) {
    console.log('✅ SRTParser Test Passed');
} else {
    console.error('❌ SRTParser Test Failed');
    process.exit(1);
}
