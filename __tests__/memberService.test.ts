import memberService from '../src/graphql/member/service'
import { prismaMock } from '../prisma/prismaMock'
import { Member } from '@prisma/client'

describe('getMembers test', () => {
  it('모든 멤버를 반환해야 한다', async () => {
    const mockMembers: Member[] = []

    for (let i = 0; i < 10; i++) {
      const mockMember: Member = {
        id: i + 1,
        email: `example${i}@example.com`,
        address: `address: example${i}`,
        name: `name${i}`,
        password: `password${i}`,
        createdAt: new Date('2100-10-10'),
      }
      mockMembers.push(mockMember)
    }

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const result = await memberService.getMembers();
    expect(result).toEqual(mockMembers);
    expect(prismaMock.member.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });
})
