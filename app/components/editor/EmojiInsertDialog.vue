<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Insert Emoji</DialogTitle>
        <DialogDescription>
          Choose an emoji to insert into your document
        </DialogDescription>
      </DialogHeader>
      
      <div class="mt-4">
        <TooltipProvider>
          <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-6">
            <TabsTrigger value="recent">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>🕒</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Recently used</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="smileys">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>😀</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Smileys & People</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="animals">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>🐶</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Animals & Nature</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="food">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>🍎</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Food & Drink</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>⚽</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activities</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger value="objects">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span>💡</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Objects</p>
                </TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in recentEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
            <div v-if="recentEmojis.length === 0" class="text-center text-gray-500 py-8">
              No recently used emojis
            </div>
          </TabsContent>
          
          <TabsContent value="smileys" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in smileyEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="animals" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in animalEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="food" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in foodEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="activities" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in activityEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="objects" class="mt-4">
            <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in objectEmojis"
                :key="emoji.char"
                @click="selectEmoji(emoji)"
                class="p-2 hover:bg-gray-100 rounded text-2xl transition-colors"
                :title="emoji.name"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span>{{ emoji.char }}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ emoji.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </button>
            </div>
          </TabsContent>
        </Tabs>
        </TooltipProvider>
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Emoji {
  char: string
  name: string
  shortcode: string
}

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'insert-emoji', emoji: Emoji): void
}>()

const activeTab = ref('recent')
const recentEmojis = ref<Emoji[]>([])

// Check if emoji is supported on the current OS
function isEmojiSupported(emoji: string): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 10
  canvas.height = 10
  const ctx = canvas.getContext('2d')
  if (!ctx) return false
  
  ctx.textBaseline = 'top'
  ctx.font = '8px Arial'
  ctx.fillText(emoji, 0, 0)
  
  return ctx.getImageData(0, 0, 10, 10).data.some(pixel => pixel !== 0)
}

// Filter emojis based on OS support
function filterSupportedEmojis(emojis: Emoji[]): Emoji[] {
  return emojis.filter(emoji => isEmojiSupported(emoji.char))
}

// Emoji data - these are commonly supported across all platforms
const smileyEmojis = ref<Emoji[]>([
  { char: '😀', name: 'Grinning Face', shortcode: ':grinning:' },
  { char: '😃', name: 'Grinning Face with Big Eyes', shortcode: ':smiley:' },
  { char: '😄', name: 'Grinning Face with Smiling Eyes', shortcode: ':smile:' },
  { char: '😁', name: 'Beaming Face with Smiling Eyes', shortcode: ':grin:' },
  { char: '😆', name: 'Grinning Squinting Face', shortcode: ':laughing:' },
  { char: '😅', name: 'Grinning Face with Sweat', shortcode: ':sweat_smile:' },
  { char: '🤣', name: 'Rolling on the Floor Laughing', shortcode: ':rofl:' },
  { char: '😂', name: 'Face with Tears of Joy', shortcode: ':joy:' },
  { char: '🙂', name: 'Slightly Smiling Face', shortcode: ':slightly_smiling_face:' },
  { char: '🙃', name: 'Upside-Down Face', shortcode: ':upside_down_face:' },
  { char: '😉', name: 'Winking Face', shortcode: ':wink:' },
  { char: '😊', name: 'Smiling Face with Smiling Eyes', shortcode: ':blush:' },
  { char: '😇', name: 'Smiling Face with Halo', shortcode: ':innocent:' },
  { char: '🥰', name: 'Smiling Face with Hearts', shortcode: ':smiling_face_with_hearts:' },
  { char: '😍', name: 'Smiling Face with Heart-Eyes', shortcode: ':heart_eyes:' },
  { char: '🤩', name: 'Star-Struck', shortcode: ':star_struck:' },
  { char: '😘', name: 'Face Blowing a Kiss', shortcode: ':kissing_heart:' },
  { char: '😗', name: 'Kissing Face', shortcode: ':kissing:' },
  { char: '😚', name: 'Kissing Face with Closed Eyes', shortcode: ':kissing_closed_eyes:' },
  { char: '😙', name: 'Kissing Face with Smiling Eyes', shortcode: ':kissing_smiling_eyes:' },
  { char: '🥲', name: 'Smiling Face with Tear', shortcode: ':smiling_face_with_tear:' },
  { char: '😋', name: 'Face Savoring Food', shortcode: ':yum:' },
  { char: '😛', name: 'Face with Tongue', shortcode: ':stuck_out_tongue:' },
  { char: '😜', name: 'Winking Face with Tongue', shortcode: ':stuck_out_tongue_winking_eye:' },
  { char: '🤪', name: 'Zany Face', shortcode: ':zany_face:' },
  { char: '😝', name: 'Squinting Face with Tongue', shortcode: ':stuck_out_tongue_closed_eyes:' },
  { char: '🤑', name: 'Money-Mouth Face', shortcode: ':money_mouth_face:' },
  { char: '🤗', name: 'Smiling Face with Open Hands', shortcode: ':hugs:' },
  { char: '🤭', name: 'Face with Hand Over Mouth', shortcode: ':hand_over_mouth:' },
  { char: '🫢', name: 'Face with Open Eyes and Hand Over Mouth', shortcode: ':face_with_open_eyes_and_hand_over_mouth:' },
  { char: '🫣', name: 'Face with Peeking Eye', shortcode: ':face_with_peeking_eye:' },
  { char: '🤫', name: 'Shushing Face', shortcode: ':shushing_face:' },
  { char: '🤔', name: 'Thinking Face', shortcode: ':thinking:' },
  { char: '🫡', name: 'Saluting Face', shortcode: ':saluting_face:' },
  { char: '🤐', name: 'Zipper-Mouth Face', shortcode: ':zipper_mouth_face:' },
  { char: '🤨', name: 'Face with Raised Eyebrow', shortcode: ':raised_eyebrow:' },
  { char: '😐', name: 'Neutral Face', shortcode: ':neutral_face:' },
  { char: '😑', name: 'Expressionless Face', shortcode: ':expressionless:' },
  { char: '😶', name: 'Face Without Mouth', shortcode: ':no_mouth:' },
  { char: '🫥', name: 'Dotted Line Face', shortcode: ':dotted_line_face:' },
  { char: '😶‍🌫️', name: 'Face in Clouds', shortcode: ':face_in_clouds:' },
  { char: '😏', name: 'Smirking Face', shortcode: ':smirk:' },
  { char: '😒', name: 'Unamused Face', shortcode: ':unamused:' },
  { char: '🙄', name: 'Face with Rolling Eyes', shortcode: ':roll_eyes:' },
  { char: '😬', name: 'Grimacing Face', shortcode: ':grimacing:' },
  { char: '😮‍💨', name: 'Face Exhaling', shortcode: ':face_exhaling:' },
  { char: '🤥', name: 'Lying Face', shortcode: ':lying_face:' },
  { char: '😌', name: 'Relieved Face', shortcode: ':relieved:' },
  { char: '😔', name: 'Pensive Face', shortcode: ':pensive:' },
  { char: '😪', name: 'Sleepy Face', shortcode: ':sleepy:' },
  { char: '🤤', name: 'Drooling Face', shortcode: ':drooling_face:' },
  { char: '😴', name: 'Sleeping Face', shortcode: ':sleeping:' },
])

const animalEmojis = ref<Emoji[]>([
  { char: '🐶', name: 'Dog Face', shortcode: ':dog:' },
  { char: '🐱', name: 'Cat Face', shortcode: ':cat:' },
  { char: '🐭', name: 'Mouse Face', shortcode: ':mouse:' },
  { char: '🐹', name: 'Hamster', shortcode: ':hamster:' },
  { char: '🐰', name: 'Rabbit Face', shortcode: ':rabbit:' },
  { char: '🦊', name: 'Fox', shortcode: ':fox_face:' },
  { char: '🐻', name: 'Bear', shortcode: ':bear:' },
  { char: '🐼', name: 'Panda', shortcode: ':panda_face:' },
  { char: '🐨', name: 'Koala', shortcode: ':koala:' },
  { char: '🐯', name: 'Tiger Face', shortcode: ':tiger:' },
  { char: '🦁', name: 'Lion', shortcode: ':lion:' },
  { char: '🐮', name: 'Cow Face', shortcode: ':cow:' },
  { char: '🐷', name: 'Pig Face', shortcode: ':pig:' },
  { char: '🐽', name: 'Pig Nose', shortcode: ':pig_nose:' },
  { char: '🐸', name: 'Frog', shortcode: ':frog:' },
  { char: '🐵', name: 'Monkey Face', shortcode: ':monkey_face:' },
  { char: '🙈', name: 'See-No-Evil Monkey', shortcode: ':see_no_evil:' },
  { char: '🙉', name: 'Hear-No-Evil Monkey', shortcode: ':hear_no_evil:' },
  { char: '🙊', name: 'Speak-No-Evil Monkey', shortcode: ':speak_no_evil:' },
  { char: '🐒', name: 'Monkey', shortcode: ':monkey:' },
  { char: '🐔', name: 'Chicken', shortcode: ':chicken:' },
  { char: '🐧', name: 'Penguin', shortcode: ':penguin:' },
  { char: '🐦', name: 'Bird', shortcode: ':bird:' },
  { char: '🐤', name: 'Baby Chick', shortcode: ':baby_chick:' },
  { char: '🐣', name: 'Hatching Chick', shortcode: ':hatching_chick:' },
  { char: '🐥', name: 'Front-Facing Baby Chick', shortcode: ':hatched_chick:' },
  { char: '🦆', name: 'Duck', shortcode: ':duck:' },
  { char: '🦅', name: 'Eagle', shortcode: ':eagle:' },
  { char: '🦉', name: 'Owl', shortcode: ':owl:' },
  { char: '🦇', name: 'Bat', shortcode: ':bat:' },
  { char: '🐺', name: 'Wolf', shortcode: ':wolf:' },
  { char: '🐗', name: 'Boar', shortcode: ':boar:' },
  { char: '🐴', name: 'Horse Face', shortcode: ':horse:' },
  { char: '🦄', name: 'Unicorn', shortcode: ':unicorn:' },
  { char: '🐝', name: 'Honeybee', shortcode: ':bee:' },
  { char: '🪲', name: 'Beetle', shortcode: ':beetle:' },
  { char: '🦋', name: 'Butterfly', shortcode: ':butterfly:' },
  { char: '🐌', name: 'Snail', shortcode: ':snail:' },
  { char: '🐞', name: 'Lady Beetle', shortcode: ':ladybug:' },
  { char: '🐜', name: 'Ant', shortcode: ':ant:' },
  { char: '🪰', name: 'Fly', shortcode: ':fly:' },
  { char: '🪱', name: 'Worm', shortcode: ':worm:' },
  { char: '🦗', name: 'Cricket', shortcode: ':cricket:' },
  { char: '🕷️', name: 'Spider', shortcode: ':spider:' },
  { char: '🕸️', name: 'Spider Web', shortcode: ':spider_web:' },
  { char: '🦂', name: 'Scorpion', shortcode: ':scorpion:' },
  { char: '🐢', name: 'Turtle', shortcode: ':turtle:' },
  { char: '🐍', name: 'Snake', shortcode: ':snake:' },
  { char: '🦎', name: 'Lizard', shortcode: ':lizard:' },
  { char: '🦖', name: 'T-Rex', shortcode: ':t-rex:' },
  { char: '🦕', name: 'Sauropod', shortcode: ':sauropod:' },
])

const foodEmojis = ref<Emoji[]>([
  { char: '🍎', name: 'Red Apple', shortcode: ':apple:' },
  { char: '🍏', name: 'Green Apple', shortcode: ':green_apple:' },
  { char: '🍊', name: 'Tangerine', shortcode: ':tangerine:' },
  { char: '🍋', name: 'Lemon', shortcode: ':lemon:' },
  { char: '🍌', name: 'Banana', shortcode: ':banana:' },
  { char: '🍉', name: 'Watermelon', shortcode: ':watermelon:' },
  { char: '🍇', name: 'Grapes', shortcode: ':grapes:' },
  { char: '🍓', name: 'Strawberry', shortcode: ':strawberry:' },
  { char: '🫐', name: 'Blueberries', shortcode: ':blueberries:' },
  { char: '🍈', name: 'Melon', shortcode: ':melon:' },
  { char: '🍒', name: 'Cherries', shortcode: ':cherries:' },
  { char: '🍑', name: 'Peach', shortcode: ':peach:' },
  { char: '🥭', name: 'Mango', shortcode: ':mango:' },
  { char: '🍍', name: 'Pineapple', shortcode: ':pineapple:' },
  { char: '🥥', name: 'Coconut', shortcode: ':coconut:' },
  { char: '🥝', name: 'Kiwi Fruit', shortcode: ':kiwi_fruit:' },
  { char: '🍅', name: 'Tomato', shortcode: ':tomato:' },
  { char: '🍆', name: 'Eggplant', shortcode: ':eggplant:' },
  { char: '🥑', name: 'Avocado', shortcode: ':avocado:' },
  { char: '🥦', name: 'Broccoli', shortcode: ':broccoli:' },
  { char: '🥬', name: 'Leafy Greens', shortcode: ':leafy_greens:' },
  { char: '🥒', name: 'Cucumber', shortcode: ':cucumber:' },
  { char: '🌶️', name: 'Hot Pepper', shortcode: ':hot_pepper:' },
  { char: '🫑', name: 'Bell Pepper', shortcode: ':bell_pepper:' },
  { char: '🌽', name: 'Ear of Corn', shortcode: ':corn:' },
  { char: '🥕', name: 'Carrot', shortcode: ':carrot:' },
  { char: '🫒', name: 'Olive', shortcode: ':olive:' },
  { char: '🧄', name: 'Garlic', shortcode: ':garlic:' },
  { char: '🧅', name: 'Onion', shortcode: ':onion:' },
  { char: '🥔', name: 'Potato', shortcode: ':potato:' },
  { char: '🍠', name: 'Roasted Sweet Potato', shortcode: ':sweet_potato:' },
  { char: '🥐', name: 'Croissant', shortcode: ':croissant:' },
  { char: '🥖', name: 'Baguette Bread', shortcode: ':baguette_bread:' },
  { char: '🍞', name: 'Bread', shortcode: ':bread:' },
  { char: '🥨', name: 'Pretzel', shortcode: ':pretzel:' },
  { char: '🥯', name: 'Bagel', shortcode: ':bagel:' },
  { char: '🥞', name: 'Pancakes', shortcode: ':pancakes:' },
  { char: '🧇', name: 'Waffle', shortcode: ':waffle:' },
  { char: '🧀', name: 'Cheese Wedge', shortcode: ':cheese:' },
  { char: '🍖', name: 'Meat on Bone', shortcode: ':meat_on_bone:' },
  { char: '🍗', name: 'Poultry Leg', shortcode: ':poultry_leg:' },
  { char: '🥩', name: 'Cut of Meat', shortcode: ':cut_of_meat:' },
  { char: '🥓', name: 'Bacon', shortcode: ':bacon:' },
  { char: '🍔', name: 'Hamburger', shortcode: ':hamburger:' },
  { char: '🍟', name: 'French Fries', shortcode: ':fries:' },
  { char: '🍕', name: 'Pizza', shortcode: ':pizza:' },
  { char: '🌭', name: 'Hot Dog', shortcode: ':hotdog:' },
  { char: '🥪', name: 'Sandwich', shortcode: ':sandwich:' },
  { char: '🌮', name: 'Taco', shortcode: ':taco:' },
  { char: '🌯', name: 'Burrito', shortcode: ':burrito:' },
])

const activityEmojis = ref<Emoji[]>([
  { char: '⚽', name: 'Soccer Ball', shortcode: ':soccer:' },
  { char: '🏀', name: 'Basketball', shortcode: ':basketball:' },
  { char: '🏈', name: 'American Football', shortcode: ':football:' },
  { char: '⚾', name: 'Baseball', shortcode: ':baseball:' },
  { char: '🥎', name: 'Softball', shortcode: ':softball:' },
  { char: '🎾', name: 'Tennis', shortcode: ':tennis:' },
  { char: '🏐', name: 'Volleyball', shortcode: ':volleyball:' },
  { char: '🏉', name: 'Rugby Football', shortcode: ':rugby_football:' },
  { char: '🥏', name: 'Flying Disc', shortcode: ':flying_disc:' },
  { char: '🎱', name: 'Pool 8 Ball', shortcode: ':8ball:' },
  { char: '🪀', name: 'Yo-Yo', shortcode: ':yo_yo:' },
  { char: '🏓', name: 'Ping Pong', shortcode: ':ping_pong:' },
  { char: '🏸', name: 'Badminton', shortcode: ':badminton:' },
  { char: '🥅', name: 'Goal Net', shortcode: ':goal_net:' },
  { char: '⛳', name: 'Flag in Hole', shortcode: ':golf:' },
  { char: '🪁', name: 'Kite', shortcode: ':kite:' },
  { char: '🏹', name: 'Bow and Arrow', shortcode: ':bow_and_arrow:' },
  { char: '🎣', name: 'Fishing Pole', shortcode: ':fishing_pole_and_fish:' },
  { char: '🤿', name: 'Diving Mask', shortcode: ':diving_mask:' },
  { char: '🥊', name: 'Boxing Glove', shortcode: ':boxing_glove:' },
  { char: '🥋', name: 'Martial Arts Uniform', shortcode: ':martial_arts_uniform:' },
  { char: '🎽', name: 'Running Shirt', shortcode: ':running_shirt_with_sash:' },
  { char: '🛹', name: 'Skateboard', shortcode: ':skateboard:' },
  { char: '🛷', name: 'Sled', shortcode: ':sled:' },
  { char: '⛸️', name: 'Ice Skate', shortcode: ':ice_skate:' },
  { char: '🥌', name: 'Curling Stone', shortcode: ':curling_stone:' },
  { char: '🎿', name: 'Skis', shortcode: ':ski:' },
  { char: '⛷️', name: 'Skier', shortcode: ':skier:' },
  { char: '🏂', name: 'Snowboarder', shortcode: ':snowboarder:' },
  { char: '🪂', name: 'Parachute', shortcode: ':parachute:' },
  { char: '🏋️‍♀️', name: 'Woman Lifting Weights', shortcode: ':weight_lifting_woman:' },
  { char: '🏋️‍♂️', name: 'Man Lifting Weights', shortcode: ':weight_lifting_man:' },
  { char: '🤼‍♀️', name: 'Women Wrestling', shortcode: ':women_wrestling:' },
  { char: '🤼‍♂️', name: 'Men Wrestling', shortcode: ':men_wrestling:' },
  { char: '🤸‍♀️', name: 'Woman Cartwheeling', shortcode: ':woman_cartwheeling:' },
  { char: '🤸‍♂️', name: 'Man Cartwheeling', shortcode: ':man_cartwheeling:' },
  { char: '⛹️‍♀️', name: 'Woman Bouncing Ball', shortcode: ':woman_bouncing_ball:' },
  { char: '⛹️‍♂️', name: 'Man Bouncing Ball', shortcode: ':man_bouncing_ball:' },
  { char: '🤺', name: 'Person Fencing', shortcode: ':person_fencing:' },
  { char: '🤾‍♀️', name: 'Woman Playing Handball', shortcode: ':woman_playing_handball:' },
  { char: '🤾‍♂️', name: 'Man Playing Handball', shortcode: ':man_playing_handball:' },
  { char: '🏌️‍♀️', name: 'Woman Golfing', shortcode: ':woman_golfing:' },
  { char: '🏌️‍♂️', name: 'Man Golfing', shortcode: ':man_golfing:' },
  { char: '🏇', name: 'Horse Racing', shortcode: ':horse_racing:' },
  { char: '🧘‍♀️', name: 'Woman in Lotus Position', shortcode: ':woman_in_lotus_position:' },
  { char: '🧘‍♂️', name: 'Man in Lotus Position', shortcode: ':man_in_lotus_position:' },
  { char: '🏄‍♀️', name: 'Woman Surfing', shortcode: ':woman_surfing:' },
  { char: '🏄‍♂️', name: 'Man Surfing', shortcode: ':man_surfing:' },
  { char: '🏊‍♀️', name: 'Woman Swimming', shortcode: ':woman_swimming:' },
  { char: '🏊‍♂️', name: 'Man Swimming', shortcode: ':man_swimming:' },
])

const objectEmojis = ref<Emoji[]>([
  { char: '💡', name: 'Light Bulb', shortcode: ':bulb:' },
  { char: '🔦', name: 'Flashlight', shortcode: ':flashlight:' },
  { char: '🕯️', name: 'Candle', shortcode: ':candle:' },
  { char: '🪔', name: 'Diya Lamp', shortcode: ':diya_lamp:' },
  { char: '🔥', name: 'Fire', shortcode: ':fire:' },
  { char: '🧯', name: 'Fire Extinguisher', shortcode: ':fire_extinguisher:' },
  { char: '🛢️', name: 'Oil Drum', shortcode: ':oil_drum:' },
  { char: '💸', name: 'Money with Wings', shortcode: ':money_with_wings:' },
  { char: '💵', name: 'Dollar Banknote', shortcode: ':dollar:' },
  { char: '💴', name: 'Yen Banknote', shortcode: ':yen:' },
  { char: '💶', name: 'Euro Banknote', shortcode: ':euro:' },
  { char: '💷', name: 'Pound Banknote', shortcode: ':pound:' },
  { char: '🪙', name: 'Coin', shortcode: ':coin:' },
  { char: '💰', name: 'Money Bag', shortcode: ':moneybag:' },
  { char: '💳', name: 'Credit Card', shortcode: ':credit_card:' },
  { char: '💎', name: 'Gem Stone', shortcode: ':gem:' },
  { char: '⚖️', name: 'Balance Scale', shortcode: ':balance_scale:' },
  { char: '🪜', name: 'Ladder', shortcode: ':ladder:' },
  { char: '🧰', name: 'Toolbox', shortcode: ':toolbox:' },
  { char: '🔧', name: 'Wrench', shortcode: ':wrench:' },
  { char: '🔨', name: 'Hammer', shortcode: ':hammer:' },
  { char: '⚒️', name: 'Hammer and Pick', shortcode: ':hammer_and_pick:' },
  { char: '🛠️', name: 'Hammer and Wrench', shortcode: ':hammer_and_wrench:' },
  { char: '⛏️', name: 'Pick', shortcode: ':pick:' },
  { char: '🪚', name: 'Carpentry Saw', shortcode: ':carpentry_saw:' },
  { char: '🔩', name: 'Nut and Bolt', shortcode: ':nut_and_bolt:' },
  { char: '⚙️', name: 'Gear', shortcode: ':gear:' },
  { char: '🪤', name: 'Mouse Trap', shortcode: ':mouse_trap:' },
  { char: '🧲', name: 'Magnet', shortcode: ':magnet:' },
  { char: '🪣', name: 'Bucket', shortcode: ':bucket:' },
  { char: '🔫', name: 'Water Pistol', shortcode: ':gun:' },
  { char: '🧨', name: 'Firecracker', shortcode: ':firecracker:' },
  { char: '🪓', name: 'Axe', shortcode: ':axe:' },
  { char: '🔪', name: 'Kitchen Knife', shortcode: ':hocho:' },
  { char: '🗡️', name: 'Dagger', shortcode: ':dagger:' },
  { char: '⚔️', name: 'Crossed Swords', shortcode: ':crossed_swords:' },
  { char: '🛡️', name: 'Shield', shortcode: ':shield:' },
  { char: '🚬', name: 'Cigarette', shortcode: ':smoking:' },
  { char: '⚰️', name: 'Coffin', shortcode: ':coffin:' },
  { char: '🪦', name: 'Headstone', shortcode: ':headstone:' },
  { char: '⚱️', name: 'Funeral Urn', shortcode: ':funeral_urn:' },
  { char: '🏺', name: 'Amphora', shortcode: ':amphora:' },
  { char: '🔮', name: 'Crystal Ball', shortcode: ':crystal_ball:' },
  { char: '📿', name: 'Prayer Beads', shortcode: ':prayer_beads:' },
  { char: '🧿', name: 'Nazar Amulet', shortcode: ':nazar_amulet:' },
  { char: '💈', name: 'Barber Pole', shortcode: ':barber:' },
  { char: '⚗️', name: 'Alembic', shortcode: ':alembic:' },
  { char: '🔭', name: 'Telescope', shortcode: ':telescope:' },
  { char: '🔬', name: 'Microscope', shortcode: ':microscope:' },
])

// Load recent emojis from localStorage
onMounted(() => {
  const saved = localStorage.getItem('recent-emojis')
  if (saved) {
    try {
      recentEmojis.value = JSON.parse(saved)
    } catch {
      // Ignore parsing errors
    }
  }
  
  // Filter emojis based on OS support
  smileyEmojis.value = filterSupportedEmojis(smileyEmojis.value)
  animalEmojis.value = filterSupportedEmojis(animalEmojis.value)
  foodEmojis.value = filterSupportedEmojis(foodEmojis.value)
  activityEmojis.value = filterSupportedEmojis(activityEmojis.value)
  objectEmojis.value = filterSupportedEmojis(objectEmojis.value)
})

function selectEmoji(emoji: Emoji) {
  // Add to recent emojis
  const filtered = recentEmojis.value.filter(e => e.char !== emoji.char)
  recentEmojis.value = [emoji, ...filtered].slice(0, 24) // Keep only 24 recent emojis
  
  // Save to localStorage
  localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value))
  
  // Emit the emoji
  emit('insert-emoji', emoji)
  emit('update:open', false)
}
</script>
