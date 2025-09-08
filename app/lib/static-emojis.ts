export interface EmojiStatic {
  char: string
  name: string
  shortcode: string
  category?: string
  keywords?: string[]
}

// Curated static emoji list used for fast UI rendering. Keep this list focused
// and add more items as needed. Categories are intentionally the canonical
// category strings the UI expects (smileys, people, animals, food, activities,
// travel, objects, symbols, flags, nature).
export const STATIC_EMOJIS: EmojiStatic[] = [
  { char: '😀', name: 'Grinning Face', shortcode: ':grinning:', category: 'smileys', keywords: ['happy', 'smile', 'face'] },
  { char: '😁', name: 'Beaming Face With Smiling Eyes', shortcode: ':grin:', category: 'smileys', keywords: ['smile', 'happy', 'teeth'] },
  { char: '😂', name: 'Face With Tears of Joy', shortcode: ':joy:', category: 'smileys', keywords: ['laugh', 'tears'] },
  { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:', category: 'smileys', keywords: ['lol', 'laugh'] },
  { char: '😊', name: 'Smiling Face With Smiling Eyes', shortcode: ':blush:', category: 'smileys', keywords: ['smile', 'pleased'] },
  { char: '😇', name: 'Smiling Face With Halo', shortcode: ':innocent:', category: 'smileys', keywords: ['angel', 'halo'] },
  { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:', category: 'smileys', keywords: ['meh', 'soft'] },
  { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down:', category: 'smileys', keywords: ['silly', 'playful'] },
  { char: '😉', name: 'Winking Face', shortcode: ':wink:', category: 'smileys', keywords: ['flirt', 'joke'] },
  { char: '😌', name: 'Relieved Face', shortcode: ':relieved:', category: 'smileys', keywords: ['relief'] },
  { char: '😍', name: 'Smiling Face With Heart-Eyes', shortcode: ':heart_eyes:', category: 'smileys', keywords: ['love', 'adore'] },
  { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:', category: 'smileys', keywords: ['kiss', 'love'] },
  { char: '😜', name: 'Winking Face With Tongue', shortcode: ':stuck_out_tongue_winking_eye:', category: 'smileys', keywords: ['silly', 'tongue'] },
  { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:', category: 'smileys', keywords: ['crazy', 'goofy'] },
  { char: '😎', name: 'Smiling Face With Sunglasses', shortcode: ':sunglasses:', category: 'smileys', keywords: ['cool'] },

  { char: '👋', name: 'Waving Hand', shortcode: ':wave:', category: 'people', keywords: ['hello', 'goodbye'] },
  { char: '🤚', name: 'Raised Back of Hand', shortcode: ':raised_back_of_hand:', category: 'people', keywords: ['hand'] },
  { char: '🫶', name: 'Heart Hands', shortcode: ':heart_hands:', category: 'people', keywords: ['love'] },
  { char: '👍', name: 'Thumbs Up', shortcode: ':thumbsup:', category: 'people', keywords: ['approve', 'like'] },
  { char: '👎', name: 'Thumbs Down', shortcode: ':thumbsdown:', category: 'people', keywords: ['dislike'] },
  { char: '👏', name: 'Clapping Hands', shortcode: ':clap:', category: 'people', keywords: ['applause'] },
  { char: '🙏', name: 'Folded Hands', shortcode: ':pray:', category: 'people', keywords: ['please', 'thanks'] },
  { char: '🤝', name: 'Handshake', shortcode: ':handshake:', category: 'people', keywords: ['agree', 'deal'] },
  { char: '💪', name: 'Flexed Biceps', shortcode: ':muscle:', category: 'people', keywords: ['strength'] },

  { char: '🐶', name: 'Dog Face', shortcode: ':dog:', category: 'animals', keywords: ['pet', 'puppy'] },
  { char: '🐱', name: 'Cat Face', shortcode: ':cat:', category: 'animals', keywords: ['pet', 'kitty'] },
  { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:', category: 'animals', keywords: ['rodent'] },
  { char: '🦊', name: 'Fox Face', shortcode: ':fox:', category: 'animals', keywords: ['sly'] },
  { char: '🐻', name: 'Bear Face', shortcode: ':bear:', category: 'animals', keywords: ['wild'] },
  { char: '🐼', name: 'Panda Face', shortcode: ':panda_face:', category: 'animals', keywords: ['cute'] },
  { char: '🦁', name: 'Lion Face', shortcode: ':lion:', category: 'animals', keywords: ['king'] },
  { char: '🐵', name: 'Monkey Face', shortcode: ':monkey:', category: 'animals', keywords: ['funny'] },
  { char: '🐸', name: 'Frog Face', shortcode: ':frog:', category: 'animals', keywords: ['amphibian'] },
  { char: '🦄', name: 'Unicorn Face', shortcode: ':unicorn:', category: 'animals', keywords: ['myth', 'magical'] },

  { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:', category: 'food', keywords: ['fruit'] },
  { char: '🍎', name: 'Red Apple', shortcode: ':apple:', category: 'food', keywords: ['fruit'] },
  { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:', category: 'food', keywords: ['fruit'] },
  { char: '🍌', name: 'Banana', shortcode: ':banana:', category: 'food', keywords: ['fruit'] },
  { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:', category: 'food', keywords: ['fruit'] },
  { char: '🍇', name: 'Grapes', shortcode: ':grapes:', category: 'food', keywords: ['fruit'] },
  { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:', category: 'food', keywords: ['berry'] },
  { char: '🍕', name: 'Pizza', shortcode: ':pizza:', category: 'food', keywords: ['cheese', 'slice'] },
  { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:', category: 'food', keywords: ['burger'] },
  { char: '🍣', name: 'Sushi', shortcode: ':sushi:', category: 'food', keywords: ['fish', 'rice'] },

  { char: '✈️', name: 'Airplane', shortcode: ':airplane:', category: 'travel', keywords: ['flight'] },
  { char: '🚗', name: 'Automobile', shortcode: ':car:', category: 'travel', keywords: ['drive'] },
  { char: '🚲', name: 'Bicycle', shortcode: ':bicycle:', category: 'travel', keywords: ['bike'] },
  { char: '🗺️', name: 'World Map', shortcode: ':world_map:', category: 'travel', keywords: ['map'] },
  { char: '🏝️', name: 'Desert Island', shortcode: ':island:', category: 'travel', keywords: ['vacation'] },
  { char: '🏖️', name: 'Beach With Umbrella', shortcode: ':beach:', category: 'travel', keywords: ['sun'] },

  { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:', category: 'activities', keywords: ['sports', 'ball'] },
  { char: '🏀', name: 'Basketball', shortcode: ':basketball:', category: 'activities', keywords: ['sports'] },
  { char: '🏈', name: 'American Football', shortcode: ':football:', category: 'activities', keywords: ['sports'] },
  { char: '🎾', name: 'Tennis', shortcode: ':tennis:', category: 'activities', keywords: ['sports'] },
  { char: '🏊', name: 'Swimmer', shortcode: ':swimmer:', category: 'activities', keywords: ['water'] },

  { char: '💡', name: 'Light Bulb', shortcode: ':bulb:', category: 'objects', keywords: ['idea'] },
  { char: '📌', name: 'Pushpin', shortcode: ':pushpin:', category: 'objects', keywords: ['pin'] },
  { char: '📎', name: 'Paperclip', shortcode: ':paperclip:', category: 'objects', keywords: ['attach'] },
  { char: '🔒', name: 'Locked', shortcode: ':lock:', category: 'objects', keywords: ['secure'] },
  { char: '🔑', name: 'Key', shortcode: ':key:', category: 'objects', keywords: ['unlock'] },

  { char: '❤️', name: 'Red Heart', shortcode: ':heart:', category: 'symbols', keywords: ['love'] },
  { char: '💛', name: 'Yellow Heart', shortcode: ':yellow_heart:', category: 'symbols', keywords: ['love'] },
  { char: '⭐', name: 'Star', shortcode: ':star:', category: 'symbols', keywords: ['favorite'] },
  { char: '🔥', name: 'Fire', shortcode: ':fire:', category: 'symbols', keywords: ['hot'] },
  { char: '✅', name: 'Check Mark Button', shortcode: ':white_check_mark:', category: 'symbols', keywords: ['ok'] },

  { char: '🇺🇸', name: 'Flag: United States', shortcode: ':flag-us:', category: 'flags', keywords: ['usa'] },
  { char: '🇬🇧', name: 'Flag: United Kingdom', shortcode: ':flag-uk:', category: 'flags', keywords: ['uk'] },
  { char: '🇨🇦', name: 'Flag: Canada', shortcode: ':flag-ca:', category: 'flags', keywords: ['canada'] },
  { char: '🇯🇵', name: 'Flag: Japan', shortcode: ':flag-jp:', category: 'flags', keywords: ['japan'] },

  { char: '☀️', name: 'Sun', shortcode: ':sunny:', category: 'nature', keywords: ['weather'] },
  { char: '🌧️', name: 'Cloud With Rain', shortcode: ':rain_cloud:', category: 'nature', keywords: ['rain'] },
  { char: '❄️', name: 'Snowflake', shortcode: ':snowflake:', category: 'nature', keywords: ['cold'] },
  { char: '🌈', name: 'Rainbow', shortcode: ':rainbow:', category: 'nature', keywords: ['colorful'] }
]

export default STATIC_EMOJIS
