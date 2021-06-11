#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const htmlTemplate = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Template</title>
    </head>
    <body>
        <h1>Hello</h1>
        <p>CLI</p>
    </body>
</html>
`;

const routerTemplate = `
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
`;

const exist = (dir) => { // 폴더 존재 확인 함수
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const mkdirp = (dir) => { // 경로 생성 함수
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = (type, name, directory) => { // 템플릿 생성 함수
    console.log(type, ':', name, ":", directory);
    mkdirp(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(chalk.bold.green(pathToFile, '생성 완료'));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(chalk.bold.green(pathToFile, '생성 완료'));
        }
    } else {
        console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
    }
};

program
    .version('1.0.0', '-v, --version')  // 프로그램 버전
    .name('cli');

program
    .command('template <type>') // 명령어를 설정
    .usage('<type> --filename [filename] --path [path]') // 명령어의 사용법
    .description('템플릿을 생성합니다.') // 명령어에 대한 설명 설정
    .alias('tmpl') // 명령어 별칭 설정
    .option('-f, --filename [filename]', '파일명을 입력하세요.', 'index') // 부가적인 옵션 설정
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options) => {
        makeTemplate(type, options.filename, options.directory); // 명령어 실제 동작 정의
    });

program
    .action((cmd, args) => {
        console.log(args);
        if (args) {
            console.log(chalk.bold.red('해당 명령어를 찾을 수 없습니다.'));
            program.help();
        } else {
            inquirer.prompt([{
                type: 'list',
                name: 'type',
                message: '템플릿 종류를 선택하세요.',
                choices: ['html', 'express-router']
            }, {
                type: 'input',
                name: 'name',
                message: '파일의 이름을 입력하세요.',
                default: 'index'
            }, {
                type: 'input',
                name: 'directory',
                message: '파일이 위치할 폴더의 경로를 입력하세요.',
                default: '.'
            }, {
                type: 'confirm',
                name: 'confirm',
                message: '생성하시겠습니까?'
            }])
                .then((answers) => {
                    if (answers.confirm) {
                        makeTemplate(answers.type, answers.name, answers.directory);
                        console.log(chalk.rgb(128, 128, 128)('터미널을 종료'));
                    }
                });
        }
    })
    .parse(process.argv);
    // .command('*', { noHelp: true }) // 명령어를 설정
    // .action(() => {
    //     console.log('해당 명령어를 찾을 수 없습니다.');
    //     program.help(); // 설명서 보여주는 옵션
    // });

// program
//     .parse(process.argv); // 명령어와 옵션을 파싱, program 마지막에 붙이는 메서드

// requiredOption : 필수로 입력해야 하는 옵션 지정