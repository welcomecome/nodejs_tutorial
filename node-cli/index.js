#!/usr/bin/env node
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rl.question('예제가 재미있습니까? (y/n) ', (answer) => {
//     if (answer === 'y') {
//         console.log('감사합니다!');
//     } else if (answer === 'n') {
//         console.log('죄송합니다!');
//     } else {
//         console.log('y 또는 n만 입력하세요.');
//     }
//     rl.close();
// });

console.clear();
const answerCallback = (answer) => {
    if (answer === 'y') {
        console.log('감사합니다!');
        rl.close();
    } else if (answer === 'n') {
        console.log('죄송합니다!');
        rl.close();
    } else {
        console.clear();
        console.log('y 또는 n만 입력하세요.');
        rl.question('예제가 재미있습니까? (y/n)', answerCallback);
    }
}

rl.question('예제가 재미있습니까? (y/n)', answerCallback);

// CLI 프로그램  삭제방법 : npm 전역 제거 명령어 호출
// npm rm -g node-cli