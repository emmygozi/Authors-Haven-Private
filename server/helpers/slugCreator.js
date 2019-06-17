import slugify from 'slugify';


const uniqueSlugTag = () => {
  const timestamp = new Date().getUTCMilliseconds();
  let text = '';
  const possibleOutcomes = 'ABCDEabcdeuvwyz0123456789';
  for (let i = 0; i < 5; i += 1) {
    text += possibleOutcomes.charAt(Math.floor(Math.random() * possibleOutcomes.length));
  }


  return (text.concat(timestamp));
};

const slugCreator = (makeIntoSlug) => {
  const uniqueSlugString = uniqueSlugTag();

  // eslint-disable-next-line no-useless-escape
  const regex = /[.,\/#!@+#$$%\^&\*;:{}=\-_`~()\s]/g;
  const slugWithoutPunctuations = makeIntoSlug.replace(regex, ' ');

  const createSlug = `${slugWithoutPunctuations} ${uniqueSlugString}`;
  const slug = slugify(createSlug, {
    replacement: '-',
    remove: null,
    lower: true
  });
  return slug;
};


export default slugCreator;
