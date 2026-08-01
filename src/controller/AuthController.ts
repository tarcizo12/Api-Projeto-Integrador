import { Request, Response } from 'express'
import { User } from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) return res.status(400).json({ message: 'Email já cadastrado.' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, name, password: hashedPassword })

    res.status(201).json({ message: 'Usuário criado com sucesso', user: { id: user.id, email: user.email } })
  } catch (error) {
    res.status(500).json({ message: 'Erro no cadastro', error })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Email ou senha incorretos.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Email ou senha incorretos.' })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error })
  }
}
