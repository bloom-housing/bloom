import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column()
  passwordHash: string
  @Column()
  email: string
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
}

export { User as default, User }
