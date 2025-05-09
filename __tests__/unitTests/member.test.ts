import memberService from '../../src/graphql/member/service';
import { createLoaders } from '../../src/context/loaders';
import { prismaMock } from '../../prisma/mocks/prismaMock';
import { Member, Order } from '@prisma/client';
import { JoinMemberDto } from '../../src/graphql/member/joinMember.dto';
import { GraphQLError } from 'graphql';

describe('member schema test', () => {
  it('getMembers()는 모든 Member를 반환해야 한다', async () => {
    const mockMembers: Member[] = [];

    for (let i = 0; i < 10; i++) {
      const mockMember: Member = {
        id: i + 1,
        email: `example${i}@example.com`,
        address: `address: example${i}`,
        name: `name${i}`,
        password: `password${i}`,
        createdAt: new Date('2100-10-10'),
      };
      mockMembers.push(mockMember);
    }

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const result = await memberService.getMembers();
    expect(result).toEqual(mockMembers);
    expect(prismaMock.member.findMany).toHaveBeenCalled();
    expect(result.length).toBe(10);
  });

  it('해당 테스트는 memberResolver.Member.orders의 내부동작을 재현한다. DataLoader를 사용해 멤버별 주문을 배치 조회해야 하며, load는 두번, 쿼리는 한번 나가야 한다', async () => {
    const mockOrders: Order[] = [
      { id: 1, buyerId: 1, createdAt: new Date('2100-10-10') },
      { id: 2, buyerId: 1, createdAt: new Date('2100-10-10') },
      { id: 3, buyerId: 2, createdAt: new Date('2100-10-10') },
    ];

    prismaMock.order.findMany.mockResolvedValue(mockOrders);

    const context = createLoaders();

    const [result1, result2] = await Promise.all([
      context.ordersLoader.load(1),
      context.ordersLoader.load(2),
    ]);

    expect(prismaMock.order.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: {
        buyerId: { in: [1, 2] },
      },
      include: {
        buyer: true,
        delivery: true,
      },
    });

    expect(result1).toEqual([{ ...mockOrders[0] }, { ...mockOrders[1] }]);
    expect(result2).toEqual([{ ...mockOrders[2] }]);
  });

  it('joinMember는 생성된 Member를 반환하고, 문제 없이 생성되어야 한다', async () => {
    const mockMember: Member = {
      id: 1,
      email: 'example1@example.com',
      address: 'address: 1',
      name: 'example name1',
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.member.create.mockResolvedValue(mockMember);

    const createMember = await memberService.joinMember(
      new JoinMemberDto(
        mockMember.email,
        mockMember.name,
        mockMember.password,
        mockMember.address as string
      )
    );

    expect(createMember).toEqual({
      ...mockMember,
      createdAt: new Date('2100-10-10'),
    });
  });

  it('joinMember.validator의 검증으로 올바르지 않은 이메일은 에러가 발생해야 한다.', async () => {
    const validEmail = 'wh8299@gmail.com';
    const validEmailMember: Member = {
      id: 1,
      email: validEmail,
      address: 'address: 1',
      name: 'name1',
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.member.create.mockResolvedValue(validEmailMember);

    const createMember = await memberService.joinMember(
      new JoinMemberDto(
        validEmailMember.email,
        validEmailMember.name,
        validEmailMember.password,
        validEmailMember.address as string
      )
    );

    expect(createMember).toEqual(validEmailMember);

    const unvalidEmail = 'aaa';
    const unvalidEmailMember: Member = {
      id: 1,
      email: unvalidEmail,
      address: 'address: 1',
      name: 'name1',
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    await memberService
      .joinMember(
        new JoinMemberDto(
          unvalidEmailMember.email,
          unvalidEmailMember.name,
          unvalidEmailMember.password,
          unvalidEmailMember.address as string
        )
      )
      .catch((e) => {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message).toBe(
          '이메일 형식이 올바르지 않습니다. \'@\'를 포함한 유효한 이메일을 입력해주세요.'
        );
        expect(e.extensions.code).toBe('INVALID_EMAIL_FORMAT');
      });
  });

  it('joinMember.validator의 검증으로 8~20자의 영문자와 숫자를 포함하지 않은 비밀번호는 에러가 발생해야 한다.', async () => {
    const validPassword = 'asdfqwer1234';
    const validPasswordMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: 'address: 1',
      name: 'name1',
      password: validPassword,
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.member.create.mockResolvedValue(validPasswordMember);

    const createMember = await memberService.joinMember(
      new JoinMemberDto(
        validPasswordMember.email,
        validPasswordMember.name,
        validPasswordMember.password,
        validPasswordMember.address as string
      )
    );

    expect(createMember).toEqual(validPasswordMember);

    const unvalidPassword = 'aa';
    const unvalidPasswordMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: 'address: 1',
      name: 'name1',
      password: unvalidPassword,
      createdAt: new Date('2100-10-10'),
    };

    await memberService
      .joinMember(
        new JoinMemberDto(
          unvalidPasswordMember.email,
          unvalidPasswordMember.name,
          unvalidPasswordMember.password,
          unvalidPasswordMember.address as string
        )
      )
      .catch((e) => {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message).toBe(
          '비밀번호 형식이 올바르지 않습니다. 8~20자의 영문자와 숫자를 포함해야 합니다.'
        );
        expect(e.extensions.code).toBe('INVALID_PASSWORD_FORMAT');
      });
  });

  it('joinMember.validator의 검증으로 20글자를 초과하는 이름은 에러가 발생해야 한다.', async () => {
    const validName = 'my_name_is_example';
    const validNameMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: 'address: 1',
      name: validName,
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.member.create.mockResolvedValue(validNameMember);

    const createMember = await memberService.joinMember(
      new JoinMemberDto(
        validNameMember.email,
        validNameMember.name,
        validNameMember.password,
        validNameMember.address as string
      )
    );

    expect(createMember).toEqual(validNameMember);

    const invalidName = 'n'.repeat(21);
    expect(invalidName.length).toBe(21);

    const invalidNameMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: 'address: 1',
      name: invalidName,
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    await memberService
      .joinMember(
        new JoinMemberDto(
          invalidNameMember.email,
          invalidNameMember.name,
          invalidNameMember.password,
          invalidNameMember.address as string
        )
      )
      .catch((e) => {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message).toBe(
          '이름의 길이가 올바르지 않습니다. 20자 이하의 이름을(를) 입력해주세요.'
        );
        expect(e.extensions.code).toBe('INVALID_NAME_LENGTH');
      });
  });

  it('joinMember.validator의 검증으로 100글자 이상의 주소는 에러가 발생해야 한다.', async () => {
    const validAddress = 'address: 1';
    const validAddressMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: validAddress,
      name: 'name1',
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    prismaMock.member.create.mockResolvedValue(validAddressMember);

    const createMember = await memberService.joinMember(
      new JoinMemberDto(
        validAddressMember.email,
        validAddressMember.name,
        validAddressMember.password,
        validAddressMember.address as string
      )
    );

    expect(createMember).toEqual(validAddressMember);

    const invalidAddress = 'a'.repeat(101);
    expect(invalidAddress.length).toBe(101);

    const invalidAddressMember: Member = {
      id: 1,
      email: 'example1@example1.com',
      address: invalidAddress,
      name: 'name1',
      password: 'password1',
      createdAt: new Date('2100-10-10'),
    };

    await memberService
      .joinMember(
        new JoinMemberDto(
          invalidAddressMember.email,
          invalidAddressMember.name,
          invalidAddressMember.password,
          invalidAddressMember.address as string
        )
      )
      .catch((e) => {
        expect(e).toBeInstanceOf(GraphQLError);
        expect(e.message).toBe(
          '주소의 길이가 올바르지 않습니다. 100자 이하의 주소을(를) 입력해주세요.'
        );
        expect(e.extensions.code).toBe('INVALID_ADDRESS_LENGTH');
      });
  });
});
