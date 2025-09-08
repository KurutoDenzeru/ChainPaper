export interface EmojiStatic {
  char: string
  name: string
  shortcode: string
  category?: string
  keywords?: string[]
}

// Curated static emoji list. Categories are canonical keys used by the UI
// (smileys, people, animals, food, activities, travel, objects, symbols,
// flags, nature). This list is intentionally curated for fast UI and can be
// extended or replaced by a full dataset in `public/emoji.json` if needed.
export const STATIC_EMOJIS: EmojiStatic[] = [
  // Smileys & Emotion (expanded)
  { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['happy', 'smile'] },
  { char: '😃', name: 'Grinning Face With Big Eyes', shortcode: ':smiley:', category: 'smileys' },
  { char: '😄', name: 'Grinning Face With Smiling Eyes', shortcode: ':smile:', category: 'smileys' },
  { char: '😁', name: 'Beaming Face With Smiling Eyes', shortcode: ':grin:', category: 'smileys' },
  { char: '😅', name: 'Grinning Face With Sweat', shortcode: ':sweat_smile:', category: 'smileys' },
  { char: '😂', name: 'Face With Tears of Joy', shortcode: ':joy:', category: 'smileys' },
  { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:', category: 'smileys' },
  { char: '😇', name: 'Smiling Face With Halo', shortcode: ':innocent:', category: 'smileys' },
  { char: '😊', name: 'Smiling Face With Smiling Eyes', shortcode: ':blush:', category: 'smileys' },
  { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:', category: 'smileys' },
  { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down:', category: 'smileys' },
  { char: '😉', name: 'Winking Face', shortcode: ':wink:', category: 'smileys' },
  { char: '😌', name: 'Relieved Face', shortcode: ':relieved:', category: 'smileys' },
  { char: '😍', name: 'Smiling Face With Heart-Eyes', shortcode: ':heart_eyes:', category: 'smileys' },
  { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:', category: 'smileys' },
  { char: '😜', name: 'Winking Face With Tongue', shortcode: ':stuck_out_tongue_winking_eye:', category: 'smileys' },
  { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:', category: 'smileys' },
  { char: '😎', name: 'Smiling Face With Sunglasses', shortcode: ':sunglasses:', category: 'smileys' },
  { char: '🤩', name: 'Star-Struck', shortcode: ':star_struck:', category: 'smileys' },
  { char: '🤔', name: 'Thinking Face', shortcode: ':thinking:', category: 'smileys' },
  { char: '🤨', name: 'Raised Eyebrow', shortcode: ':raised_eyebrow:', category: 'smileys' },
  { char: '😐', name: 'Neutral Face', shortcode: ':neutral_face:', category: 'smileys' },
  { char: '😶', name: 'Face Without Mouth', shortcode: ':no_mouth:', category: 'smileys' },
  { char: '😴', name: 'Sleeping Face', shortcode: ':sleeping:', category: 'smileys' },
  { char: '🥱', name: 'Yawning Face', shortcode: ':yawning_face:', category: 'smileys' },
  { char: '😵', name: 'Dizzy Face', shortcode: ':dizzy_face:', category: 'smileys' },

  // People & Body (expanded)
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
  { char: '👶', name: 'Baby', shortcode: ':baby:', category: 'people' },
  { char: '🧒', name: 'Child', shortcode: ':child:', category: 'people' },
  { char: '👦', name: 'Boy', shortcode: ':boy:', category: 'people' },
  { char: '👧', name: 'Girl', shortcode: ':girl:', category: 'people' },
  { char: '👨', name: 'Man', shortcode: ':man:', category: 'people' },
  { char: '👩', name: 'Woman', shortcode: ':woman:', category: 'people' },
  { char: '👴', name: 'Old Man', shortcode: ':older_man:', category: 'people' },
  { char: '👵', name: 'Old Woman', shortcode: ':older_woman:', category: 'people' },
  { char: '👮‍♂️', name: 'Police Officer', shortcode: ':police_officer:', category: 'people' },
  { char: '👷‍♀️', name: 'Construction Worker', shortcode: ':construction_worker:', category: 'people' },
  { char: '💃', name: 'Dancer', shortcode: ':dancer:', category: 'people' },
  { char: '🕺', name: 'Man Dancing', shortcode: ':man_dancing:', category: 'people' },

  // Animals & Nature (expanded)
  { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals' },
  { char: '🐱', name: 'Cat Face', shortcode: ':cat:', category: 'animals' },
  { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:', category: 'animals' },
  { char: '🐹', name: 'Hamster Face', shortcode: ':hamster:', category: 'animals' },
  { char: '🐰', name: 'Rabbit Face', shortcode: ':rabbit:', category: 'animals' },
  { char: '🦊', name: 'Fox Face', shortcode: ':fox:', category: 'animals' },
  { char: '🐻', name: 'Bear Face', shortcode: ':bear:', category: 'animals' },
  { char: '🐼', name: 'Panda Face', shortcode: ':panda_face:', category: 'animals' },
  { char: '🦁', name: 'Lion Face', shortcode: ':lion:', category: 'animals' },
  { char: '🐵', name: 'Monkey Face', shortcode: ':monkey:', category: 'animals' },
  { char: '🐸', name: 'Frog Face', shortcode: ':frog:', category: 'animals' },
  { char: '🐔', name: 'Chicken', shortcode: ':chicken:', category: 'animals' },
  { char: '🐦', name: 'Bird', shortcode: ':bird:', category: 'animals' },
  { char: '🐝', name: 'Honeybee', shortcode: ':bee:', category: 'animals' },
  { char: '🦋', name: 'Butterfly', shortcode: ':butterfly:', category: 'animals' },
  { char: '🐢', name: 'Turtle', shortcode: ':turtle:', category: 'animals' },
  { char: '🌲', name: 'Evergreen Tree', shortcode: ':evergreen_tree:', category: 'nature' },
  { char: '🌳', name: 'Deciduous Tree', shortcode: ':deciduous_tree:', category: 'nature' },
  { char: '🌷', name: 'Tulip', shortcode: ':tulip:', category: 'nature' },
  { char: '🌹', name: 'Rose', shortcode: ':rose:', category: 'nature' },
  { char: '🌞', name: 'Sun With Face', shortcode: ':sun_with_face:', category: 'nature' },
  { char: '🌧️', name: 'Cloud With Rain', shortcode: ':cloud_with_rain:', category: 'nature' },
  { char: '❄️', name: 'Snowflake', shortcode: ':snowflake:', category: 'nature' },

  // Food & Drink (expanded)
  { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:', category: 'food' },
  { char: '🍎', name: 'Red Apple', shortcode: ':apple:', category: 'food' },
  { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:', category: 'food' },
  { char: '🍌', name: 'Banana', shortcode: ':banana:', category: 'food' },
  { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:', category: 'food' },
  { char: '🍇', name: 'Grapes', shortcode: ':grapes:', category: 'food' },
  { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:', category: 'food' },
  { char: '🍒', name: 'Cherries', shortcode: ':cherries:', category: 'food' },
  { char: '🍑', name: 'Peach', shortcode: ':peach:', category: 'food' },
  { char: '🍕', name: 'Pizza', shortcode: ':pizza:', category: 'food' },
  { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:', category: 'food' },
  { char: '🍟', name: 'French Fries', shortcode: ':fries:', category: 'food' },
  { char: '🍣', name: 'Sushi', shortcode: ':sushi:', category: 'food' },
  { char: '🍰', name: 'Shortcake', shortcode: ':cake:', category: 'food' },
  { char: '🍩', name: 'Doughnut', shortcode: ':doughnut:', category: 'food' },
  { char: '☕', name: 'Hot Beverage', shortcode: ':coffee:', category: 'food' },
  { char: '🍷', name: 'Wine Glass', shortcode: ':wine_glass:', category: 'food' },
  { char: '🍺', name: 'Beer Mug', shortcode: ':beer:', category: 'food' },

  // Activities & Sports (expanded)
  { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:', category: 'activities' },
  { char: '🏀', name: 'Basketball', shortcode: ':basketball:', category: 'activities' },
  { char: '🏈', name: 'American Football', shortcode: ':football:', category: 'activities' },
  { char: '🎾', name: 'Tennis', shortcode: ':tennis:', category: 'activities' },
  { char: '🏊', name: 'Swimmer', shortcode: ':swimmer:', category: 'activities' },
  { char: '🏓', name: 'Ping Pong', shortcode: ':ping_pong:', category: 'activities' },
  { char: '🏸', name: 'Badminton', shortcode: ':badminton:', category: 'activities' },
  { char: '🎮', name: 'Video Game', shortcode: ':video_game:', category: 'activities' },
  { char: '🎧', name: 'Headphone', shortcode: ':headphones:', category: 'activities' },

  // Travel & Transport (expanded)
  { char: '✈️', name: 'Airplane', shortcode: ':airplane:', category: 'travel' },
  { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel' },
  { char: '🚕', name: 'Taxi', shortcode: ':taxi:', category: 'travel' },
  { char: '🚙', name: 'SUV', shortcode: ':suv:', category: 'travel' },
  { char: '🚌', name: 'Bus', shortcode: ':bus:', category: 'travel' },
  { char: '🚲', name: 'Bicycle', shortcode: ':bicycle:', category: 'travel' },
  { char: '🏍️', name: 'Motorcycle', shortcode: ':motorcycle:', category: 'travel' },
  { char: '🚆', name: 'Train', shortcode: ':train:', category: 'travel' },
  { char: '🚀', name: 'Rocket', shortcode: ':rocket:', category: 'travel' },
  { char: '🚢', name: 'Ship', shortcode: ':ship:', category: 'travel' },

  // Objects & Tools (expanded)
  { char: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'objects' },
  { char: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'objects' },
  { char: '📎', name: 'Paperclip', shortcode: ':paperclip:', category: 'objects' },
  { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'objects' },
  { char: '🔑', name: 'Key', shortcode: ':key:', category: 'objects' },
  { char: '📷', name: 'Camera', shortcode: ':camera:', category: 'objects' },
  { char: '🖊️', name: 'Pen', shortcode: ':pen:', category: 'objects' },
  { char: '📚', name: 'Books', shortcode: ':books:', category: 'objects' },
  { char: '🧭', name: 'Compass', shortcode: ':compass:', category: 'objects' },

  // Symbols (expanded)
  { char: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'symbols' },
  { char: '💛', name: 'Yellow Heart', shortcode: ':yellow_heart:', category: 'symbols' },
  { char: '💯', name: 'Hundred Points', shortcode: ':100:', category: 'symbols' },
  { char: '✨', name: 'Sparkles', shortcode: ':sparkles:', category: 'symbols' },
  { char: '🔥', name: 'Fire', shortcode: ':fire:', category: 'symbols' },
  { char: '✅', name: 'Check Mark', shortcode: ':white_check_mark:', category: 'symbols' },
  { char: '❌', name: 'Cross Mark', shortcode: ':x:', category: 'symbols' },
  { char: '❓', name: 'Question Mark', shortcode: ':question:', category: 'symbols' },
  { char: '❗', name: 'Exclamation', shortcode: ':exclamation:', category: 'symbols' },

  // Flags (expanded subset)
  { char: '🇺🇸', name: 'Flag: United States', shortcode: ':flag-us:', category: 'flags' },
  { char: '🇬🇧', name: 'Flag: United Kingdom', shortcode: ':flag-uk:', category: 'flags' },
  { char: '🇨🇦', name: 'Flag: Canada', shortcode: ':flag-ca:', category: 'flags' },
  { char: '🇯🇵', name: 'Flag: Japan', shortcode: ':flag-jp:', category: 'flags' },
  { char: '🇫🇷', name: 'Flag: France', shortcode: ':flag-fr:', category: 'flags' },
  { char: '🇩🇪', name: 'Flag: Germany', shortcode: ':flag-de:', category: 'flags' },
  { char: '🇪🇸', name: 'Flag: Spain', shortcode: ':flag-es:', category: 'flags' },
  { char: '🇮🇳', name: 'Flag: India', shortcode: ':flag-in:', category: 'flags' },
  { char: '🇨🇳', name: 'Flag: China', shortcode: ':flag-cn:', category: 'flags' },
  { char: '🇰🇷', name: 'Flag: South Korea', shortcode: ':flag-kr:', category: 'flags' },
  { char: '🇦🇺', name: 'Flag: Australia', shortcode: ':flag-au:', category: 'flags' },
  { char: '🇧🇷', name: 'Flag: Brazil', shortcode: ':flag-br:', category: 'flags' },

  // A few misc nature / seasonal icons
  { char: '🌺', name: 'Hibiscus', shortcode: ':hibiscus:', category: 'nature' },
  { char: '🌸', name: 'Cherry Blossom', shortcode: ':cherry_blossom:', category: 'nature' },
  { char: '🌻', name: 'Sunflower', shortcode: ':sunflower:', category: 'nature' },
  { char: '🍂', name: 'Fallen Leaf', shortcode: ':fallen_leaf:', category: 'nature' },
  { char: '🍁', name: 'Maple Leaf', shortcode: ':maple_leaf:', category: 'nature' },
  { char: '🌈', name: 'Rainbow', shortcode: ':rainbow:', category: 'nature' }
]

export default STATIC_EMOJIS
