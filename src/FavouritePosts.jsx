import {Table, ActionIcon, Loader, Anchor, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import {IconHeartFilled} from "@tabler/icons-react";

export default function FavouritePosts({activeTab, redditIds}) {
    const [tableRows, setTableRows] = useState([]);
    const [redditData, setRedditData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        if (activeTab === 'favourite') {
            const getData = async (id) => {
                return await axios.get(`https://www.reddit.com/comments/${id}/.json`).then((r) => {
                    setRedditData((prevState) => [...prevState, {
                            score: r.data[0]?.data?.children[0]?.data?.score,
                            id: r.data[0]?.data?.children[0]?.data?.id,
                            title: r.data[0]?.data?.children[0]?.data?.title,
                            link: r.data[0]?.data?.children[0]?.data?.permalink,
                            author: r.data[0]?.data?.children[0]?.data?.author,
                        }]
                    )
                })

            }
            setRedditData([]);
            const counter = 0;
            redditIds?.map(async (id) => {
                await getData(id, counter)
            })
        }
        else{
            setTableRows([]);
            setRedditData([]);
        }
    }, [activeTab])

    function removePostFromFavourites(id) {
        setRedditData((prevState) => prevState.filter((post) => post.id !== id));
        const filteredArray = localStorage.getItem('reddit_ids')?.split(',').filter((redditId) => redditId !== id) ?? [];
        if (filteredArray.length > 0) {
            localStorage.setItem('reddit_ids', filteredArray.toString());
        }
        else{
            localStorage.removeItem('reddit_ids');
        }
    }

    useEffect(() => {
        setTableRows(redditData.map((data) => {
            return (<tr key={data.id}>
                <td>{data.score}</td>
                <td style={{textAlign: 'left'}}>{data.title}</td>
                <td style={{textAlign: 'left'}}>{data.author}</td>
                <td style={{textAlign: 'left'}}><Anchor component="a" href={`https://reddit.com/${data.link}`}>Link</Anchor></td>
                <td><ActionIcon
                    onClick={() => removePostFromFavourites(data.id)}>
                    <IconHeartFilled/> </ActionIcon></td>
            </tr>)
        }))
        if (redditData.length === redditIds.length){
            setIsLoading(false);
        }
    }, [redditData]);

    return (<>
        { redditIds?.length > 0 ? isLoading ? <Loader/> :
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
            </Table> : <Title order={4}>Nothing Saved</Title>}
    </>);

}