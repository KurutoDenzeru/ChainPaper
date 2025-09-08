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
// extended or replaced by a full dataset in `public/emoji-full.json` if needed.
export const STATIC_EMOJIS: EmojiStatic[] = [
  // Smileys & Emotion (expanded)
  { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['happy', 'smile'] },
  { char: '😃', name: 'Grinning Face With Big Eyes', shortcode: ':smiley:', category: 'smileys' },
  { char: '😄', name: 'Grinning Face With Smiling Eyes', shortcode: ':smile:', category: 'smileys' },
  { char: '😁', name: 'Beaming Face With Smiling Eyes', shortcode: ':grin:', category: 'smileys' },
  { char: '😆', name: 'Grinning Squinting Face', shortcode: ':laughing:', category: 'smileys' },
  { char: '😅', name: 'Grinning Face With Sweat', shortcode: ':sweat_smile:', category: 'smileys' },
  { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:', category: 'smileys' },
  { char: '😂', name: 'Face With Tears of Joy', shortcode: ':joy:', category: 'smileys' },
  { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:', category: 'smileys' },
  { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down:', category: 'smileys' },
  { char: '😉', name: 'Winking Face', shortcode: ':wink:', category: 'smileys' },
  { char: '😊', name: 'Smiling Face With Smiling Eyes', shortcode: ':blush:', category: 'smileys' },
  { char: '😍', name: 'Smiling Face With Heart-Eyes', shortcode: ':heart_eyes:', category: 'smileys' },
  { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:', category: 'smileys' },
  { char: '😗', name: 'Kissing Face', shortcode: ':kissing:', category: 'smileys' },
  { char: '😙', name: 'Kissing Face With Smiling Eyes', shortcode: ':kissing_smiling_eyes:', category: 'smileys' },
  { char: '😚', name: 'Kissing Face With Closed Eyes', shortcode: ':kissing_closed_eyes:', category: 'smileys' },
  { char: '😋', name: 'Face Savoring Food', shortcode: ':yum:', category: 'smileys' },
  { char: '😛', name: 'Face With Tongue', shortcode: ':stuck_out_tongue:', category: 'smileys' },
  { char: '😜', name: 'Winking Face With Tongue', shortcode: ':stuck_out_tongue_winking_eye:', category: 'smileys' },
  { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:', category: 'smileys' },
  { char: '😝', name: 'Squinting Face With Tongue', shortcode: ':stuck_out_tongue_closed_eyes:', category: 'smileys' },
  { char: '🤨', name: 'Face With Raised Eyebrow', shortcode: ':raised_eyebrow:', category: 'smileys' },
  { char: '🧐', name: 'Face With Monocle', shortcode: ':monocle_face:', category: 'smileys' },
  { char: '🤓', name: 'Nerd Face', shortcode: ':nerd_face:', category: 'smileys' },
  { char: '😎', name: 'Smiling Face With Sunglasses', shortcode: ':sunglasses:', category: 'smileys' },
  { char: '🤩', name: 'Star-Struck', shortcode: ':star_struck:', category: 'smileys' },
  { char: '🥳', name: 'Partying Face', shortcode: ':partying_face:', category: 'smileys' },
  { char: '🤯', name: 'Exploding Head', shortcode: ':exploding_head:', category: 'smileys' },
  { char: '😴', name: 'Sleeping Face', shortcode: ':sleeping:', category: 'smileys' },
  { char: '🤤', name: 'Drooling Face', shortcode: ':drooling_face:', category: 'smileys' },
  { char: '😪', name: 'Sleepy Face', shortcode: ':sleepy:', category: 'smileys' },
  { char: '😵', name: 'Dizzy Face', shortcode: ':dizzy_face:', category: 'smileys' },
  { char: '😶', name: 'Face Without Mouth', shortcode: ':no_mouth:', category: 'smileys' },
  { char: '😐', name: 'Neutral Face', shortcode: ':neutral_face:', category: 'smileys' },
  { char: '😑', name: 'Expressionless Face', shortcode: ':expressionless:', category: 'smileys' },
  { char: '😬', name: 'Grimacing Face', shortcode: ':grimacing:', category: 'smileys' },
  { char: '🙁', name: 'Slightly Frowning Face', shortcode: ':slightly_frowning_face:', category: 'smileys' },
  { char: '☹️', name: 'Frowning Face', shortcode: ':frowning_face:', category: 'smileys' },
  { char: '😮', name: 'Face With Open Mouth', shortcode: ':open_mouth:', category: 'smileys' },
  { char: '😯', name: 'Hushed Face', shortcode: ':hushed:', category: 'smileys' },
  { char: '😲', name: 'Astonished Face', shortcode: ':astonished:', category: 'smileys' },
  { char: '😳', name: 'Flushed Face', shortcode: ':flushed:', category: 'smileys' },
  { char: '🥺', name: 'Pleading Face', shortcode: ':pleading_face:', category: 'smileys' },
  { char: '😥', name: 'Sad but Relieved Face', shortcode: ':disappointed_relieved:', category: 'smileys' },
  { char: '😢', name: 'Crying Face', shortcode: ':cry:', category: 'smileys' },
  { char: '😭', name: 'Loudly Crying Face', shortcode: ':sob:', category: 'smileys' },
  { char: '🤗', name: 'Hugging Face', shortcode: ':hugs:', category: 'smileys' },

  // People & Body (expanded)
  { char: '👋', name: 'Waving Hand', shortcode: ':wave:', category: 'people' },
  { char: '🤚', name: 'Raised Back of Hand', shortcode: ':raised_back_of_hand:', category: 'people' },
  { char: '🖐️', name: 'Raised Hand', shortcode: ':hand:', category: 'people' },
  { char: '✋', name: 'Raised Hand With Fingers Splayed', shortcode: ':raised_hand:', category: 'people' },
  { char: '🫱', name: 'Rightwards Hand', shortcode: ':rightwards_hand:', category: 'people' },
  { char: '🫲', name: 'Leftwards Hand', shortcode: ':leftwards_hand:', category: 'people' },
  { char: '👍', name: 'Thumbs Up', shortcode: ':thumbsup:', category: 'people' },
  { char: '👎', name: 'Thumbs Down', shortcode: ':thumbsdown:', category: 'people' },
  { char: '👏', name: 'Clapping Hands', shortcode: ':clap:', category: 'people' },
  { char: '🙌', name: 'Raising Hands', shortcode: ':raised_hands:', category: 'people' },
  { char: '👐', name: 'Open Hands', shortcode: ':open_hands:', category: 'people' },
  { char: '🤝', name: 'Handshake', shortcode: ':handshake:', category: 'people' },
  { char: '🙏', name: 'Folded Hands', shortcode: ':pray:', category: 'people' },
  { char: '💪', name: 'Flexed Biceps', shortcode: ':muscle:', category: 'people' },
  { char: '🧑', name: 'Person', shortcode: ':person:', category: 'people' },
  { char: '👦', name: 'Boy', shortcode: ':boy:', category: 'people' },
  { char: '👧', name: 'Girl', shortcode: ':girl:', category: 'people' },
  { char: '👨', name: 'Man', shortcode: ':man:', category: 'people' },
  { char: '👩', name: 'Woman', shortcode: ':woman:', category: 'people' },
  { char: '👶', name: 'Baby', shortcode: ':baby:', category: 'people' },
  { char: '🧒', name: 'Child', shortcode: ':child:', category: 'people' },
  { char: '👴', name: 'Old Man', shortcode: ':older_man:', category: 'people' },
  { char: '👵', name: 'Old Woman', shortcode: ':older_woman:', category: 'people' },
  { char: '👮', name: 'Police Officer', shortcode: ':police_officer:', category: 'people' },
  { char: '👷', name: 'Construction Worker', shortcode: ':construction_worker:', category: 'people' },
  { char: '💂', name: 'Guard', shortcode: ':guard:', category: 'people' },
  { char: '🕵️', name: 'Detective', shortcode: ':detective:', category: 'people' },
  { char: '👩‍⚕️', name: 'Health Worker', shortcode: ':health_worker:', category: 'people' },
  { char: '👨‍🍳', name: 'Cook', shortcode: ':cook:', category: 'people' },
  { char: '💃', name: 'Dancer', shortcode: ':dancer:', category: 'people' },
  { char: '🕺', name: 'Man Dancing', shortcode: ':man_dancing:', category: 'people' },

  // Animals & Nature (expanded)
  { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals' },
  { char: '🐱', name: 'Cat Face', shortcode: ':cat:', category: 'animals' },
  { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:', category: 'animals' },
  { char: '🐹', name: 'Hamster', shortcode: ':hamster:', category: 'animals' },
  { char: '🐰', name: 'Rabbit', shortcode: ':rabbit:', category: 'animals' },
  { char: '🦊', name: 'Fox', shortcode: ':fox:', category: 'animals' },
  { char: '🐻', name: 'Bear', shortcode: ':bear:', category: 'animals' },
  { char: '🐼', name: 'Panda', shortcode: ':panda_face:', category: 'animals' },
  { char: '🦁', name: 'Lion', shortcode: ':lion:', category: 'animals' },
  { char: '🐮', name: 'Cow', shortcode: ':cow:', category: 'animals' },
  { char: '🐷', name: 'Pig Face', shortcode: ':pig:', category: 'animals' },
  { char: '🐸', name: 'Frog Face', shortcode: ':frog:', category: 'animals' },
  { char: '🐵', name: 'Monkey Face', shortcode: ':monkey_face:', category: 'animals' },
  { char: '🐔', name: 'Chicken', shortcode: ':chicken:', category: 'animals' },
  { char: '🐧', name: 'Penguin', shortcode: ':penguin:', category: 'animals' },
  { char: '🐦', name: 'Bird', shortcode: ':bird:', category: 'animals' },
  { char: '🐝', name: 'Honeybee', shortcode: ':bee:', category: 'animals' },
  { char: '🦋', name: 'Butterfly', shortcode: ':butterfly:', category: 'animals' },
  { char: '🐢', name: 'Turtle', shortcode: ':turtle:', category: 'animals' },
  { char: '🐙', name: 'Octopus', shortcode: ':octopus:', category: 'animals' },
  { char: '🦈', name: 'Shark', shortcode: ':shark:', category: 'animals' },
  { char: '🌲', name: 'Evergreen Tree', shortcode: ':evergreen_tree:', category: 'nature' },
  { char: '🌳', name: 'Deciduous Tree', shortcode: ':deciduous_tree:', category: 'nature' },
  { char: '🌴', name: 'Palm Tree', shortcode: ':palm_tree:', category: 'nature' },
  { char: '🌷', name: 'Tulip', shortcode: ':tulip:', category: 'nature' },
  { char: '🌹', name: 'Rose', shortcode: ':rose:', category: 'nature' },
  { char: '🌺', name: 'Hibiscus', shortcode: ':hibiscus:', category: 'nature' },
  { char: '🌸', name: 'Cherry Blossom', shortcode: ':cherry_blossom:', category: 'nature' },
  { char: '🌞', name: 'Sun With Face', shortcode: ':sun_with_face:', category: 'nature' },
  { char: '🌈', name: 'Rainbow', shortcode: ':rainbow:', category: 'nature' },
  { char: '🍁', name: 'Maple Leaf', shortcode: ':maple_leaf:', category: 'nature' },

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
  { char: '🍍', name: 'Pineapple', shortcode: ':pineapple:', category: 'food' },
  { char: '🥭', name: 'Mango', shortcode: ':mango:', category: 'food' },
  { char: '🍕', name: 'Pizza', shortcode: ':pizza:', category: 'food' },
  { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:', category: 'food' },
  { char: '🍟', name: 'French Fries', shortcode: ':fries:', category: 'food' },
  { char: '🌮', name: 'Taco', shortcode: ':taco:', category: 'food' },
  { char: '🌯', name: 'Burrito', shortcode: ':burrito:', category: 'food' },
  { char: '🍣', name: 'Sushi', shortcode: ':sushi:', category: 'food' },
  { char: '🍱', name: 'Bento Box', shortcode: ':bento:', category: 'food' },
  { char: '🍰', name: 'Shortcake', shortcode: ':cake:', category: 'food' },
  { char: '🍩', name: 'Doughnut', shortcode: ':doughnut:', category: 'food' },
  { char: '☕', name: 'Hot Beverage', shortcode: ':coffee:', category: 'food' },
  { char: '🍺', name: 'Beer Mug', shortcode: ':beer:', category: 'food' },
  { char: '🍷', name: 'Wine Glass', shortcode: ':wine_glass:', category: 'food' },

  // Activities & Sports (expanded)
  { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:', category: 'activities' },
  { char: '🏀', name: 'Basketball', shortcode: ':basketball:', category: 'activities' },
  { char: '🏈', name: 'American Football', shortcode: ':football:', category: 'activities' },
  { char: '⚾', name: 'Baseball', shortcode: ':baseball:', category: 'activities' },
  { char: '🎾', name: 'Tennis', shortcode: ':tennis:', category: 'activities' },
  { char: '🏐', name: 'Volleyball', shortcode: ':volleyball:', category: 'activities' },
  { char: '🏓', name: 'Ping Pong', shortcode: ':ping_pong:', category: 'activities' },
  { char: '🏸', name: 'Badminton', shortcode: ':badminton:', category: 'activities' },
  { char: '🏊', name: 'Swimmer', shortcode: ':swimmer:', category: 'activities' },
  { char: '🏄', name: 'Surfer', shortcode: ':surfer:', category: 'activities' },
  { char: '🏇', name: 'Horse Racing', shortcode: ':horse_racing:', category: 'activities' },
  { char: '🎮', name: 'Video Game', shortcode: ':video_game:', category: 'activities' },
  { char: '🎧', name: 'Headphone', shortcode: ':headphones:', category: 'activities' },

  // Travel & Transport (expanded)
  { char: '✈️', name: 'Airplane', shortcode: ':airplane:', category: 'travel' },
  { char: '🛩️', name: 'Small Airplane', shortcode: ':small_airplane:', category: 'travel' },
  { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel' },
  { char: '🚕', name: 'Taxi', shortcode: ':taxi:', category: 'travel' },
  { char: '🚙', name: 'SUV', shortcode: ':suv:', category: 'travel' },
  { char: '🚌', name: 'Bus', shortcode: ':bus:', category: 'travel' },
  { char: '🚎', name: 'Trolleybus', shortcode: ':trolleybus:', category: 'travel' },
  { char: '🚲', name: 'Bicycle', shortcode: ':bicycle:', category: 'travel' },
  { char: '🛴', name: 'Scooter', shortcode: ':scooter:', category: 'travel' },
  { char: '🏍️', name: 'Motorcycle', shortcode: ':motorcycle:', category: 'travel' },
  { char: '🚆', name: 'Train', shortcode: ':train:', category: 'travel' },
  { char: '🚅', name: 'High-Speed Train', shortcode: ':bullettrain_front:', category: 'travel' },
  { char: '🚀', name: 'Rocket', shortcode: ':rocket:', category: 'travel' },
  { char: '🚢', name: 'Ship', shortcode: ':ship:', category: 'travel' },

  // Objects & Tools (expanded)
  { char: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'objects' },
  { char: '🔦', name: 'Flashlight', shortcode: ':flashlight:', category: 'objects' },
  { char: '🔌', name: 'Electric Plug', shortcode: ':electric_plug:', category: 'objects' },
  { char: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'objects' },
  { char: '📎', name: 'Paperclip', shortcode: ':paperclip:', category: 'objects' },
  { char: '📐', name: 'Triangle Ruler', shortcode: ':triangular_ruler:', category: 'objects' },
  { char: '📏', name: 'Straight Ruler', shortcode: ':ruler:', category: 'objects' },
  { char: '✂️', name: 'Scissors', shortcode: ':scissors:', category: 'objects' },
  { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'objects' },
  { char: '🔑', name: 'Key', shortcode: ':key:', category: 'objects' },
  { char: '📷', name: 'Camera', shortcode: ':camera:', category: 'objects' },
  { char: '🖊️', name: 'Pen', shortcode: ':pen:', category: 'objects' },
  { char: '📚', name: 'Books', shortcode: ':books:', category: 'objects' },
  { char: '🧭', name: 'Compass', shortcode: ':compass:', category: 'objects' },

  // Symbols (expanded)
  { char: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'symbols' },
  { char: '💙', name: 'Blue Heart', shortcode: ':blue_heart:', category: 'symbols' },
  { char: '💚', name: 'Green Heart', shortcode: ':green_heart:', category: 'symbols' },
  { char: '💛', name: 'Yellow Heart', shortcode: ':yellow_heart:', category: 'symbols' },
  { char: '🧡', name: 'Orange Heart', shortcode: ':orange_heart:', category: 'symbols' },
  { char: '💯', name: 'Hundred Points', shortcode: ':100:', category: 'symbols' },
  { char: '✨', name: 'Sparkles', shortcode: ':sparkles:', category: 'symbols' },
  { char: '🔥', name: 'Fire', shortcode: ':fire:', category: 'symbols' },
  { char: '✅', name: 'Check Mark', shortcode: ':white_check_mark:', category: 'symbols' },
  { char: '❌', name: 'Cross Mark', shortcode: ':x:', category: 'symbols' },
  { char: '❓', name: 'Question Mark', shortcode: ':question:', category: 'symbols' },
  { char: '❗', name: 'Exclamation', shortcode: ':exclamation:', category: 'symbols' },
  { char: '⚠️', name: 'Warning', shortcode: ':warning:', category: 'symbols' },
  { char: '🔔', name: 'Bell', shortcode: ':bell:', category: 'symbols' },
  { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'symbols' },

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
  { char: '🇮🇹', name: 'Flag: Italy', shortcode: ':flag-it:', category: 'flags' },
  { char: '🇷🇺', name: 'Flag: Russia', shortcode: ':flag-ru:', category: 'flags' },
  { char: '🇲🇽', name: 'Flag: Mexico', shortcode: ':flag-mx:', category: 'flags' },

  // Misc / seasonal / nature icons
  { char: '🌻', name: 'Sunflower', shortcode: ':sunflower:', category: 'nature' },
  { char: '🍂', name: 'Fallen Leaf', shortcode: ':fallen_leaf:', category: 'nature' },
  { char: '🌊', name: 'Water Wave', shortcode: ':water_wave:', category: 'nature' },
  { char: '🌋', name: 'Volcano', shortcode: ':volcano:', category: 'nature' },
  { char: '🌙', name: 'Crescent Moon', shortcode: ':crescent_moon:', category: 'nature' },
  { char: '⚡', name: 'High Voltage', shortcode: ':zap:', category: 'nature' }
]

export default STATIC_EMOJIS

// Runtime loader for the full emoji dataset.
// Tries (in order):
//  1) dynamic import of `emoji-datasource-apple` (already listed in package.json),
//  2) fetching `/emoji-full.json` from `public/` (user can place a full JSON there),
//  3) fallback to the curated STATIC_EMOJIS above.
export async function loadFullEmojiList(): Promise<EmojiStatic[]> {
  // helper: convert unified hex (e.g. "1F600" or "1F1FA-1F1F8") to characters
  function unifiedToChar(u: string | undefined, fallback?: string) {
    if (!u) return fallback || ''
    try {
      return String.fromCodePoint(...u.split('-').map(s => parseInt(s, 16)))
    } catch {
      return fallback || ''
    }
  }

  // 1) try dynamic import from emoji-datasource-apple
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('emoji-datasource-apple')
    const data = (mod && (mod.default || mod)) as any[]
    if (Array.isArray(data) && data.length) {
      const mapped = data.map(item => {
        const char = item.emoji || unifiedToChar(item.unified, item.emoji)
        const name = item.name || item.short_name || (item.short_names && item.short_names[0]) || char
        const shortcode = item.short_name ? `:${item.short_name}:` : (item.short_names && item.short_names[0] ? `:${item.short_names[0]}:` : '')
        const category = item.category ? String(item.category).toLowerCase() : undefined
        const keywords = item.keywords || item.short_names || []
        return { char, name, shortcode, category, keywords } as EmojiStatic
      })
      return mapped
    }
  } catch (e) {
    // module may not be available in some environments; silently continue to next option
  }

  // 2) try fetching a JSON file from public/emoji-full.json
  try {
    if (typeof fetch === 'function') {
      const res = await fetch('/emoji-full.json')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) return data as EmojiStatic[]
      }
    }
  } catch (_) { /* ignore fetch errors */ }

  // 3) fallback to curated list
  return STATIC_EMOJIS
}
