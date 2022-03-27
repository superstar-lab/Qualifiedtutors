const csv = require('csv-parser')
const fs = require('fs')

const levelMap = {
    ['11 Plus']: '11 Plus',
    ['13 Plus']: '13 Plus',
    ['Key Stage 1']: 'KS1 (5-7 yrs)',
    ['Key Stage 2']: 'KS2 (7-11 yrs)',
    ['Primary (up to 11 years)']: 'KS2 (7-11 yrs)',
    ['KS3 (11-14 yrs)']: 'KS3 (11-14 yrs)',
    ['GCSE (15-16 years)']: 'GCSE (15-16 yrs)',
    ['A-Level']: 'A-Level',
    ['IB']: 'IB',
    ['Nationals 4 and 5']: 'National 4 & 5',
    ['Scottish Highers']: 'Scottish Highers',
    ['Degree (or higher)']: 'Degree (or higher)',
    ['Adult / Casual learner']: 'Adult Learner',
    ['Beginner']: 'Beginner',
    ['Intermediate']: 'Intermediate',
    ['Advanced']: 'Advanced',
    ['Grade 1-3']: 'Grade 1-3',
    ['Grade 4-5']: 'Grade 4-5',
    ['Grade 6-7']: 'Grade 6-7',
    ['Grade 8+']: 'Grade 8+',
    ['International Baccalaureate']: 'IB',
    
    ['Acoustic']: "",
    ['Electric']: "",
    ['Blues']: "",
    ['Rock']: "",
    ['T-Level']: "",
    ['Maths']: "",
    ['English']: "",
    ['Level 1']: "",
    ['Level 2']: "",
    ['Numeracy/Maths Skills']: "",
    ['Literacy Skills']: "",
}

const levelWeights = {
    ['11 Plus']: 0,
    ['13 plus']: 1,
    ['KS1 (5-7 yrs)']: 2,
    ['KS2 (7-11 yrs)']: 3,
    ['KS3 (11-14 yrs)']: 4,
    ['GCSE (15-16 yrs)']: 5,
    ['A-Level']: 6,
    ['IB']: 7,
    ['National 4 & 5']: 8,
    ['Scottish Highers']: 9,
    ['Degree (or higher)']: 10,
    ['Adult Learner']: 11,
    ['Beginner']: 12,
    ['Intermediate']: 13,
    ['Advanced']: 14,
    ['Grade 1-3']: 15,
    ['Grade 4-5']: 16,
    ['Grade 6-7']: 17,
    ['Grade 8+']: 18,

}

const subjects = []
const levels = []

const subjects1 = []
const subjects2 = []
const subjects3 = []
const subjectsLevelless = []

fs.createReadStream("./1.csv")
    .pipe(csv())
    .on('data', data => subjects1.push(data))
    .on('end', () => {

fs.createReadStream("./2.csv")
    .pipe(csv())
    .on('data', data => subjects2.push(data))
    .on('end', () => {
      
fs.createReadStream("./3.csv")
    .pipe(csv())
    .on('data', data => subjects3.push(data))
    .on('end', () => {
        
fs.createReadStream("./levelless.csv")
    .pipe(csv())
    .on('data', data => subjectsLevelless.push(data))
    .on('end', () => {
        

const subjectsLeveled = [...subjects1, ...subjects2, ...subjects3]

for(const subject of subjectsLeveled) {
    
    const index = subjects.findIndex(sub => sub.subject == subject.subject)
    if (index != -1) {
        const s = subjects[index]
        let lvl
        if (levelMap.hasOwnProperty(subject.level)) {
            lvl = levelMap[subject.level]
        } else {
            lvl = subject.level
        }

        if (lvl != "") {
            if (!s.levels.includes(lvl)) {
                s.levels.push(lvl)
            }
    
            if (!levels.includes(lvl)) {
                levels.push(lvl)
            }
        }
        
        subjects[index] = s
    } else {
        const s = {
            subject: subject.subject,
            levels: [],
            category: ""
        }
        
        let lvl
        if (levelMap.hasOwnProperty(subject.level)) {
            lvl = levelMap[subject.level]
        } else {
            lvl = subject.level
        }

        if (lvl != "") {
            s.levels.push(lvl)
            if (!levels.includes(lvl)) {
                levels.push(lvl)
            }
        }

        s.category = subject.category 
        subjects.push(s)
    }
}


const levelSort = (a, b) => {
    if (levelWeights[a] > levelWeights[b]) {
        return 1
    } else if (levelWeights[a] < levelWeights[b]) {
        return -1
    } else {
        return 0
    }
}

//console.log(levels)

/*
for(const l of levels) {
    console.log(l)
}
*/

for(const index in subjects) {
    const subject = subjects[index]
    subject.levels.sort(levelSort)
    subjects[index] == subject
}

for(const sub of subjectsLevelless) {
    const index = subjects.findIndex(s => s.subject == sub.subject)
    if (index == -1) {
        subjects.push({
            subject: sub.subject,
            levels: ['Beginner', 'Intermediate', 'Advanced'],
            category: sub.category
        })
    }
}

fs.writeFileSync("./subjects.json", JSON.stringify(subjects))

    })
    })
    })
    })

