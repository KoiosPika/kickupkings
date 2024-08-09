import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XEmbed } from 'react-social-media-embed';

const TweetEmbed = ({ tweetUrls }: any) => {

    const [tweets, setTweets] = useState([])

    useEffect(() => {
        async function getTweets() {
            const res = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRfoFqWBHtHmkTZRlUoCAF7KmrVufoeBKoVETuwNNF31jKkDeGObr_sn2_VtPhPYEbBAbNv80NnV6xS/pub?output=csv');

            const tweetUrls = res.data
                .split('\n')
                .map((url: any) => url.trim())
                .filter((url: any) => url);

            setTweets(tweetUrls)
        }

        getTweets();
    }, [])

    return (
        <div>
            {tweets && tweets.map((tweet: any, index: number) => (
                <div key={index}>
                    <XEmbed url={tweet} width={350} />
                    <div className='h-[20px]' />
                </div>
            ))}
        </div>
    );
};

export default TweetEmbed;
