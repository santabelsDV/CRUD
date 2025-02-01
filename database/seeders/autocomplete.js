const {faker} = require('@faker-js/faker');
const {books} = require('../../app/models');

for (let i = 0; i < 20; i++) {
    const Pages = faker.number.int({min: 1, max: 1000});
    const Name = faker.lorem.words(3);
    const Author = faker.person.fullName();
    const Year = faker.date.past(10);

    try {
        books.create({
            Pages: Pages,
            Name: Name,
            Author: Author,
            Year: Year
        }, {
            logging: false
        });
    } catch (e) {
        console.log(e);
    }
}




