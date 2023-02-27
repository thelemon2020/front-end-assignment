import {Button, Group, Stack, TextInput, Title, Table, ActionIcon, Anchor} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import {IconHeart, IconHeartFilled} from "@tabler/icons-react";

export default function Search({activeTab}) {
    const [subreddit, setSubreddit] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);


    useEffect(() => {
        const redditIds = localStorage.getItem('reddit_ids')?.split(',') ?? [];
        setSelectedPosts(redditIds)
    }, [activeTab])

    async function getRedditPosts() {
        let response = await axios.get(`https://www.reddit.com/r/${subreddit}.json`).catch((error) => {
            setSearchResults([]);
        }).then(r => r.data)
        setSearchResults(response.data.children.slice(0, 10));
    }

    function removePostFromFavourites(id) {
        setSelectedPosts(selectedPosts.filter(post => post !== id));
        const filteredArray = localStorage.getItem('reddit_ids')?.split(',').filter((redditId) => redditId !== id)
        if (filteredArray.length > 0) {
            localStorage.setItem('reddit_ids', filteredArray.toString());
        }
        else{
            localStorage.removeItem('reddit_ids');
        }
    }

    function addPostToFavourites(id) {
        setSelectedPosts((prev) => [...prev, id]);
        let arrayToAddTo = localStorage.getItem('reddit_ids')?.split(',') ?? [];
        arrayToAddTo.push(id);
        localStorage.setItem('reddit_ids', arrayToAddTo.toString());
    }

    useEffect(() => {
        setTableRows(searchResults.map((result) => {
            let isFavourited = selectedPosts.includes(result.data.id);
            return (<tr key={result.data.id}>
                <td>{result.data.score}</td>
                <td style={{textAlign: 'left'}}>{result.data.title}</td>
                <td style={{textAlign: 'left'}}>{result.data.author}</td>
                <td style={{textAlign: 'left'}}><Anchor component="a"
                                                        href={`https://reddit.com/${result.data.permalink}`}>Link</Anchor>
                </td>
                <td><ActionIcon
                    onClick={isFavourited ? () => removePostFromFavourites(result.data.id) : () => addPostToFavourites(result.data.id)}>{isFavourited ?
                    <IconHeartFilled/> : <IconHeart/>}</ActionIcon></td>
            </tr>);
        }));
    }, [selectedPosts, searchResults]);


    return (<>
        <Stack align='center' justify='center'>
            <Title>Select Subreddit</Title>
            <Group>
                <TextInput value={subreddit} onChange={(event) => setSubreddit(event.target.value)}/>
                <Button onClick={getRedditPosts}>Submit</Button>
            </Group>
        </Stack>
        <Title order={5}>Results</Title>
        {tableRows.length > 0 ?
            <Table>
                <thead>
                <tr>
                    <th>Upvotes</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Link</th>
                    <th>Favourite?</th>
                </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </Table> : 'No Results'}
    </>);

}