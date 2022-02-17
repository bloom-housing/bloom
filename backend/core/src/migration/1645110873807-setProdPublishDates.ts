import {MigrationInterface, QueryRunner} from "typeorm";

export class setProdPublishDates1645110873807 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const toUpdate = [
            { name: 'The Mix at SoHay', date: '2021-03-10T00:16:00.000Z' },
            { name: 'City Center Apartments', date: '2021-05-14T00:16:00.000Z' },
            { name: 'Coliseum Place', date: '2021-06-02T00:16:00.000Z' },
            { name: '1475 167th Avenue', date: '2021-06-15T00:16:00.000Z' },
            { name: 'Jordan Court', date: '2021-08-25T00:16:00.000Z' },
            { name: 'Foon Lok West', date: '2021-10-04T00:16:00.000Z' },
            { name: 'Alexan Webster', date: '2021-07-22T00:16:00.000Z' },
            { name: 'Blake at Berkeley', date: '2021-10-18T00:16:00.000Z' },
            { name: 'Nova', date: '2021-06-02T00:16:00.000Z' },
            { name: 'Aurora', date: '2021-06-02T00:16:00.000Z' },
            { name: 'Loro Landing', date: '2021-09-27T00:16:00.000Z' },
            { name: 'The Starling', date: '2021-10-04T00:16:00.000Z' },
            { name: 'Corsair Flats II for Seniors 62+', date: '2022-01-05T00:16:00.000Z' },
            { name: 'Rosefield Village', date: '2022-01-07T00:16:00.000Z' },
            { name: 'Berkeley Way', date: '2022-02-08T00:16:00.000Z' },
            { name: 'Reilly Station', date: '2020-07-30T00:16:00.000Z' },
            { name: 'Monarch Homes', date: '2020-09-24T00:16:00.000Z' },
            { name: 'Atlas', date: '2020-09-08T00:16:00.000Z' },
            { name: 'Jones Berkeley', date: '2020-09-15T00:16:00.000Z' },
            { name: 'The Logan', date: '2020-10-15T00:16:00.000Z' },
            { name: 'The Skylyne at Temescal 2', date: '2020-10-06T00:16:00.000Z' },
            { name: 'Avance', date: '2021-09-30T00:16:00.000Z' }
        ]

        for (const rec of toUpdate) {
            await queryRunner.query(
                `UPDATE listings SET published_at = $1 WHERE name = $2`, [rec.date, rec.name]
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
