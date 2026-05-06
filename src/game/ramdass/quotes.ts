export interface RamDassQuote {
  id: string
  text: string
  // optional context for when this quote is most fitting
  trigger?: 'consecutive_loss' | 'checkpoint' | 'first_defeat' | 'any'
}

export const RAM_DASS_QUOTES: RamDassQuote[] = [
  {
    id: 'be_here_now',
    text: 'Be here now.',
    trigger: 'any',
  },
  {
    id: 'walking_home',
    text: "We're all just walking each other home.",
    trigger: 'any',
  },
  {
    id: 'quieter',
    text: 'The quieter you become, the more you can hear.',
    trigger: 'consecutive_loss',
  },
  {
    id: 'loved',
    text: 'You are loved just for being who you are, just for existing.',
    trigger: 'first_defeat',
  },
  {
    id: 'god_in_drag',
    text: 'Treat everyone you meet like God in drag.',
    trigger: 'any',
  },
  {
    id: 'suffering',
    text: 'The most important aspect of love is not in giving or receiving — it is in the being.',
    trigger: 'consecutive_loss',
  },
  {
    id: 'let_go',
    text: "You can't push the river. It flows by itself.",
    trigger: 'consecutive_loss',
  },
  {
    id: 'presence',
    text: 'The game is not about becoming somebody — it is about becoming nobody.',
    trigger: 'checkpoint',
  },
  {
    id: 'grace',
    text: 'The spiritual journey is not a path toward power. It is a path toward grace.',
    trigger: 'checkpoint',
  },
  {
    id: 'moment',
    text: 'Each moment is a moment of grace.',
    trigger: 'any',
  },
]
