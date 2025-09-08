export interface EmojiStatic {
  char: string
  name: string
  shortcode: string
  category?: string
  keywords?: string[]
}

// Curated static emoji list. Categories are canonical keys used by the UI
// (smileys, people, animals, food, activities, travel, objects, symbols,
// flags, nature, clothing, transport). This list is intentionally curated
// for fast UI and can be extended or replaced by a full dataset in
// `public/emoji.json` if needed.
export const STATIC_EMOJIS: EmojiStatic[] = [
  // Smileys & Emotion
  { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['happy', 'smile'] },
  { char: '😁', name: 'Beaming Face With Smiling Eyes', shortcode: ':grin:', category: 'smileys', keywords: ['grin'] },
  { char: '😂', name: 'Face With Tears of Joy', shortcode: ':joy:', category: 'smileys', keywords: ['laugh'] },
  { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:', category: 'smileys', keywords: ['lol'] },
  { char: '😊', name: 'Smiling Face With Smiling Eyes', shortcode: ':blush:', category: 'smileys', keywords: ['pleased'] },
  { char: '😇', name: 'Smiling Face With Halo', shortcode: ':innocent:', category: 'smileys', keywords: ['angel'] },
  { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:', category: 'smileys' },
  { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down:', category: 'smileys' },
  { char: '😉', name: 'Winking Face', shortcode: ':wink:', category: 'smileys' },
  { char: '😌', name: 'Relieved Face', shortcode: ':relieved:', category: 'smileys' },
  { char: '😍', name: 'Smiling Face With Heart-Eyes', shortcode: ':heart_eyes:', category: 'smileys' },
  { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:', category: 'smileys' },
  { char: '😜', name: 'Winking Face With Tongue', shortcode: ':stuck_out_tongue_winking_eye:', category: 'smileys' },
  { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:', category: 'smileys' },
  { char: '😎', name: 'Smiling Face With Sunglasses', shortcode: ':sunglasses:', category: 'smileys' },

  // People & Body
  { char: '👋', name: 'Waving Hand', shortcode: ':wave:', category: 'people' },
  { char: '🤚', name: 'Raised Back of Hand', shortcode: ':raised_back_of_hand:', category: 'people' },
  { char: '🫶', name: 'Heart Hands', shortcode: ':heart_hands:', category: 'people' },
  { char: '👍', name: 'Thumbs Up', shortcode: ':thumbsup:', category: 'people' },
  { char: '👎', name: 'Thumbs Down', shortcode: ':thumbsdown:', category: 'people' },
  { char: '👏', name: 'Clapping Hands', shortcode: ':clap:', category: 'people' },
  { char: '🙏', name: 'Folded Hands', shortcode: ':pray:', category: 'people' },
  { char: '🤝', name: 'Handshake', shortcode: ':handshake:', category: 'people' },
  { char: '💪', name: 'Flexed Biceps', shortcode: ':muscle:', category: 'people' },
  { char: '🧑', name: 'Person', shortcode: ':person:', category: 'people' },
  { char: '👩', name: 'Woman', shortcode: ':woman:', category: 'people' },
  { char: '👨', name: 'Man', shortcode: ':man:', category: 'people' },

  // Animals & Nature
  { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals' },
  { char: '🐱', name: 'Cat Face', shortcode: ':cat:', category: 'animals' },
  { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:', category: 'animals' },
  { char: '🦊', name: 'Fox Face', shortcode: ':fox:', category: 'animals' },
  { char: '🐻', name: 'Bear Face', shortcode: ':bear:', category: 'animals' },
  { char: '🐼', name: 'Panda Face', shortcode: ':panda_face:', category: 'animals' },
  { char: '🦁', name: 'Lion Face', shortcode: ':lion:', category: 'animals' },
  { char: '🐵', name: 'Monkey Face', shortcode: ':monkey:', category: 'animals' },
  { char: '🐸', name: 'Frog Face', shortcode: ':frog:', category: 'animals' },
  { char: '🦄', name: 'Unicorn Face', shortcode: ':unicorn:', category: 'animals' },
  { char: '🌲', name: 'Evergreen Tree', shortcode: ':evergreen_tree:', category: 'nature' },
  { char: '🌳', name: 'Deciduous Tree', shortcode: ':deciduous_tree:', category: 'nature' },
  { char: '🌷', name: 'Tulip', shortcode: ':tulip:', category: 'nature' },
  { char: '🌞', name: 'Sun With Face', shortcode: ':sun_with_face:', category: 'nature' },

  // Food & Drink
  { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:', category: 'food' },
  { char: '🍎', name: 'Red Apple', shortcode: ':apple:', category: 'food' },
  { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:', category: 'food' },
  { char: '🍌', name: 'Banana', shortcode: ':banana:', category: 'food' },
  { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:', category: 'food' },
  { char: '🍇', name: 'Grapes', shortcode: ':grapes:', category: 'food' },
  { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:', category: 'food' },
  { char: '🍕', name: 'Pizza', shortcode: ':pizza:', category: 'food' },
  { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:', category: 'food' },
  { char: '🍣', name: 'Sushi', shortcode: ':sushi:', category: 'food' },

  // Travel & Transport
  { char: '✈️', name: 'Airplane', shortcode: ':airplane:', category: 'travel' },
  { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel' },
  { char: '🚲', name: 'Bicycle', shortcode: ':bicycle:', category: 'travel' },
  { char: '🚆', name: 'Train', shortcode: ':train:', category: 'travel' },
  { char: '🚀', name: 'Rocket', shortcode: ':rocket:', category: 'travel' },

  // Activities & Sports
  { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:', category: 'activities' },
  { char: '🏀', name: 'Basketball', shortcode: ':basketball:', category: 'activities' },
  { char: '🏈', name: 'American Football', shortcode: ':football:', category: 'activities' },
  { char: '🎾', name: 'Tennis', shortcode: ':tennis:', category: 'activities' },
  { char: '🏊', name: 'Swimmer', shortcode: ':swimmer:', category: 'activities' },

  // Objects & Tools
  { char: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'objects' },
  { char: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'objects' },
  { char: '📎', name: 'Paperclip', shortcode: ':paperclip:', category: 'objects' },
  { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'objects' },
  { char: '🔑', name: 'Key', shortcode: ':key:', category: 'objects' },
  { char: '📷', name: 'Camera', shortcode: ':camera:', category: 'objects' },

  // Symbols
  { char: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'symbols' },
  { char: '💛', name: 'Yellow Heart', shortcode: ':yellow_heart:', category: 'symbols' },
  { char: '⭐', name: 'Star', shortcode: ':star:', category: 'symbols' },
  { char: '🔥', name: 'Fire', shortcode: ':fire:', category: 'symbols' },
  { char: '✅', name: 'Check Mark', shortcode: ':white_check_mark:', category: 'symbols' },

  // Flags (small subset)
  { char: '🇺🇸', name: 'Flag: United States', shortcode: ':flag-us:', category: 'flags' },
  { char: '🇬🇧', name: 'Flag: United Kingdom', shortcode: ':flag-uk:', category: 'flags' },
  { char: '🇨🇦', name: 'Flag: Canada', shortcode: ':flag-ca:', category: 'flags' },
  { char: '🇯🇵', name: 'Flag: Japan', shortcode: ':flag-jp:', category: 'flags' },

  // Clothing
  { char: '👕', name: 'T-Shirt', shortcode: ':tshirt:', category: 'clothing' },
  { char: '👟', name: 'Running Shoe', shortcode: ':running_shoe:', category: 'clothing' },

  // Transport (extra)
  { char: '🚢', name: 'Ship', shortcode: ':ship:', category: 'transport' },
  { char: '🛩️', name: 'Small Airplane', shortcode: ':small_airplane:', category: 'transport' }
]

export default STATIC_EMOJIS
