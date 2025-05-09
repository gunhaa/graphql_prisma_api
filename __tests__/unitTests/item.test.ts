import { Item } from "@prisma/client";


describe('item schema 관련 테스트', () => {

    it('getItems()는 모든 아이템을 반환해야 한다', async() => {
        const getItems: Item[] = [];
        for(let i=0; i<10; i++){
            const mockItem: Item = {
                id: i+1,
                category: `category${i%2}`,
            }
        }
    });

});