import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import "../main/web-dictionary.css";
import axios from "axios";
import { DictionaryApi } from "../utilities/DictionaryApi";

type PhoneticType = {
  audio: string;
};

type DefinitionType = {
  definition: string;
  example?: string;
};

type MeaningType = {
  partOfSpeech: string;
  definitions: DefinitionType[];
  synonyms?: string[];
};

type DictionaryResponseType = {
  word: string;
  phonetic: string;
  sourceUrls?: string[];
  phonetics: PhoneticType[];
  meanings: MeaningType[];
} | null;

type ErrorResponseType = {
  title: string;
  message: string;
  resolution: string;
} | null;

const WebDictionary = () => {
  const [word, setWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [definition, setDefinition] = useState<DictionaryResponseType>(null);
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<ErrorResponseType>(null);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null); // Clear previous error
    setDefinition(null); // Clear previous result

    axios
      .get(`${DictionaryApi}${word}`)
      .then((response) => {
        const data = response.data[0];
        setDefinition(data);
        setAudio(data.phonetics[0]?.audio ?? null);
        setSource(data.sourceUrls[0] ?? "");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data || {
          title: "Error",
          message: "An error occurred while fetching the data.",
          resolution: "Please try again.",
        };
        setError(errorMessage);
        setIsLoading(false);
      });
  };

  return (
    <div className="main-container min-h-screen flex flex-col items-center justify-center bg-white pb-[440px]">
      <div className="w-full px-5 mt-16 sm:w-11/12 md:w-2/3 lg:w-1/2">
        <div className="flex flex-row items-center justify-between w-full gap-0 first-div">
          <div className="flex flex-row items-center justify-center gap-5">
            <img src="/book.jpeg" alt="book" className="h-14 w-14" />
            <h1 className="text-xl font-extrabold text-black sm:text-2xl md:text-3xl">
              Web Dictionary
            </h1>
          </div>
        </div>

        <div className="w-full flex items-center justify-center relative mt-10 mr-[50px] ">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search for a word..."
            className="custom-placeholder bg-purple-100 rounded-lg h-12 focus:outline-none w-11/12 sm:w-full md:w-10/12 lg:w-full pl-6 text-black font-[Poppins]"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <CiSearch className="absolute text-lg text-purple-500 right-6 top-4 sm:text-xl" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center w-full mt-10 text-center h-80vh">
            <div className="loader"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-start w-full gap-4 mt-24 text-center h-80vh">
            <h1 className="font-serif text-xl text-red-500 sm:text-2xl md:text-3xl">
              {error.title}
            </h1>
            <p className="font-serif text-lg text-black sm:text-xl">{error.message}</p>
            <p className="font-serif text-lg text-black sm:text-xl">{error.resolution}</p>
          </div>
        ) : (
          definition && (
            <>
              <div className="flex flex-row items-center justify-between w-11/12 px-5 mt-8 sm:w-full">
                <div className="flex flex-col items-start justify-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl text-black font-extrabold font-[Poppins]">
                    {definition.word}
                  </h1>
                  <p className="text-lg text-[#c842f5] font-light">
                    {definition.phonetic}
                  </p>
                </div>
                {audio && (
                  <div
                    className="bg-[#c842f550] flex items-center justify-center rounded-full h-14 w-14 cursor-pointer"
                    onClick={() => new Audio(audio).play()}
                  >
                    <FaPlay className="text-xl sm:text-2xl text-[#c842f5]" />
                  </div>
                )}
              </div>

              {definition.meanings.map((meaning, index) => (
                <div key={index} className="w-full px-5 mt-7">
                  <div className="flex items-center justify-center w-full gap-2 font-serif">
                    <h5 className="text-lg font-bold text-black">
                      {meaning.partOfSpeech}
                    </h5>
                    <hr className="flex-grow bg-black" />
                  </div>
                  <div className="flex flex-col items-start justify-center w-full gap-5 mt-5">
                    <h1 className="pl-6 font-serif text-lg font-medium">
                      Meaning
                    </h1>
                    <div className="w-full font-serif text-black pl-14">
                      <ul className="w-full list-disc list-inside">
                        {meaning.definitions.map((item, index) => (
                          <li key={index} className="mb-3">
                            {item.definition}
                            {item.example && (
                              <>
                                <br />
                                <strong>Example:</strong> "{item.example}"
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <div className="flex flex-row items-start justify-start w-full gap-3 pl-6 font-serif mt-7">
                      <h1 className="font-serif text-lg font-medium">
                        Synonyms
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        {meaning.synonyms.map((synonym, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 text-purple-800 bg-purple-100 border border-purple-300 rounded-lg"
                          >
                            {synonym}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-center w-full px-5 mt-5 font-serif">
                <hr className="w-11/12 bg-black" />
              </div>
              {source && (
                <div className="flex flex-row items-start justify-start gap-1 pl-6 mt-5 mb-5">
                  <h1 className="font-serif text-lg font-medium">
                    Source:
                  </h1>
                  <a
                    href={source}
                    className="text-lg font-serif font-medium text-purple-600 underline w-[200px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source}
                  </a>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default WebDictionary;
