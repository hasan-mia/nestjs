import { Roles } from 'src/auth/entity/roles.entity';
import { Tokens } from 'src/auth/entity/tokens.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Tokens, (token) => token.users)
  tokens: Tokens[];

  @OneToMany(() => Roles, (role) => role.users)
  roles: Roles[];
}
